const Stepper = require('../models/Stepper');
const cloudinary = require('../config/cloudinary');

const BASE_FOLDER = process.env.CLOUDINARY_FOLDER || 'aether_onboarding';

async function uploadFromPath(localPath, options = {}) {
  const result = await cloudinary.uploader.upload(localPath, {
    folder: BASE_FOLDER,
    resource_type: 'auto',
    ...options,
  });
  return result.secure_url;
}

function uploadFromBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: BASE_FOLDER, resource_type: 'auto', ...options },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/**
 * @param {object} payload - Parsed onboarding payload (reference, submittedAt, data)
 * @param {Record<string, { path: string } | { buffer: Buffer } | null | undefined>} parts
 */
async function createSubmissionCore(payload, parts) {
  if (!payload?.reference || !payload?.submittedAt || !payload?.data) {
    const err = new Error('Missing reference, submittedAt, or data');
    err.statusCode = 400;
    throw err;
  }

  const safeRef = String(payload.reference || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
  const ts = Date.now();

  async function uploadPart(fieldName, subfolder, publicSuffix) {
    const input = parts[fieldName];
    if (!input || (!input.buffer && !input.path)) return null;
    const opts = {
      folder: `${BASE_FOLDER}/${subfolder}`,
      public_id: `${safeRef}_${ts}_${publicSuffix}`,
    };
    if (input.buffer) {
      return uploadFromBuffer(input.buffer, opts);
    }
    return uploadFromPath(input.path, opts);
  }

  const imageUrls = {
    profilePhoto: await uploadPart('profilePhoto', 'profilePhoto', 'profile'),
    idFront: await uploadPart('idFront', 'idFront', 'idFront'),
    idBack: await uploadPart('idBack', 'idBack', 'idBack'),
    signature: await uploadPart('signature', 'signature', 'signature'),
  };

  const d = payload.data;
  const doc = await Stepper.create({
    reference: payload.reference,
    submittedAt: new Date(payload.submittedAt),
    accountType: d.accountAndIdentity?.accountType ?? d.accountType ?? '',
    organization: d.organization ?? {},
    address: d.address ?? {},
    roles: d.roles ?? {},
    compliance: d.compliance ?? {},
    review: d.review ?? {},
    riskScore:
      typeof d.compliance?.riskScore === 'number'
        ? d.compliance.riskScore
        : Number(payload.riskScore) || 0,
    imageUrls,
  });

  return {
    _id: doc._id,
    reference: doc.reference,
    submittedAt: doc.submittedAt,
    imageUrls: doc.imageUrls,
  };
}

module.exports = { createSubmissionCore };
