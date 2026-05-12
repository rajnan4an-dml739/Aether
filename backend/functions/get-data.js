const Stepper = require('../models/Stepper');
const { connectDb } = require('../lib/connectDb');

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      ...extraHeaders,
    },
    body: statusCode === 204 ? '' : JSON.stringify(body),
  };
}

function isAuthorized(event) {
  const secret = process.env.API_DATA_SECRET;
  if (!secret) return true;

  const headers = event.headers || {};
  const auth = headers.authorization || headers.Authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const apiKey = headers['x-api-key'] || headers['X-Api-Key'] || '';
  const q = event.queryStringParameters || {};
  const keyParam = (q.key || '').trim();

  return bearer === secret || apiKey === secret || keyParam === secret;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method Not Allowed' }, { Allow: 'GET, OPTIONS' });
  }

  if (!isAuthorized(event)) {
    return jsonResponse(401, {
      error: 'Unauthorized',
      hint: 'Set API_DATA_SECRET in Netlify env and send Authorization: Bearer <secret>, X-Api-Key, or ?key=',
    });
  }

  try {
    await connectDb();

    const q = event.queryStringParameters || {};
    const limit = Math.min(200, Math.max(1, parseInt(q.limit, 10) || 50));
    const reference = (q.reference || '').trim();

    const filter = reference ? { reference } : {};
    const data = await Stepper.find(filter)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    return jsonResponse(200, {
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    console.error('get-data', err);
    return jsonResponse(statusCode, {
      success: false,
      error: statusCode === 503 ? err.message : 'Failed to load submissions',
    });
  }
};
