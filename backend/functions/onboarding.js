const busboy = require('busboy');
const { connectDb } = require('../lib/connectDb');
const { createSubmissionCore } = require('../services/submissionService');

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      ...extraHeaders,
    },
    body: statusCode === 204 ? '' : JSON.stringify(body),
  };
}

function parseMultipart(event) {
  const headers = event.headers || {};
  const contentType = headers['content-type'] || headers['Content-Type'];
  if (!contentType || !contentType.includes('multipart')) {
    const err = new Error('Expected multipart/form-data');
    err.statusCode = 400;
    throw err;
  }

  const bodyBuffer = event.body
    ? event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body, 'utf8')
    : Buffer.alloc(0);

  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: { 'content-type': contentType },
      limits: { fileSize: 12 * 1024 * 1024 },
    });
    const fields = {};
    const files = {};
    const filePromises = [];

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('file', (name, file, info) => {
      const p = new Promise((resolveFile, rejectFile) => {
        const chunks = [];
        file.on('data', (data) => chunks.push(data));
        file.on('limit', () => rejectFile(Object.assign(new Error('File too large'), { statusCode: 413 })));
        file.on('error', rejectFile);
        file.on('end', () => {
          files[name] = {
            buffer: Buffer.concat(chunks),
            mimetype: info.mimeType,
          };
          resolveFile();
        });
      });
      filePromises.push(p);
    });

    bb.on('error', reject);
    bb.on('finish', async () => {
      try {
        await Promise.all(filePromises);
        resolve({ fields, files });
      } catch (e) {
        reject(e);
      }
    });

    bb.end(bodyBuffer);
  });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' }, { Allow: 'POST, OPTIONS' });
  }

  try {
    await connectDb();
    const { fields, files } = await parseMultipart(event);

    let payload;
    try {
      payload =
        typeof fields.payload === 'string' ? JSON.parse(fields.payload) : fields.payload;
    } catch (_) {
      return jsonResponse(400, { message: 'Invalid JSON in payload field' });
    }

    const parts = {};
    for (const key of ['profilePhoto', 'idFront', 'idBack', 'signature']) {
      if (files[key]?.buffer?.length) {
        parts[key] = { buffer: files[key].buffer };
      }
    }

    const result = await createSubmissionCore(payload, parts);
    return jsonResponse(201, result);
  } catch (err) {
    const statusCode = err.statusCode || (err.message === 'File too large' ? 413 : 500);
    console.error('onboarding function', err);
    if (statusCode === 400) {
      return jsonResponse(400, { message: err.message });
    }
    if (statusCode === 413) {
      return jsonResponse(413, { message: 'File too large' });
    }
    return jsonResponse(statusCode === 503 ? 503 : 500, {
      message: statusCode === 503 ? err.message : 'Submission failed',
    });
  }
};
