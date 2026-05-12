const fs = require('fs');
const { createSubmissionCore } = require('../services/submissionService');

function pickFile(files, name) {
  if (!files || !files[name] || !files[name][0]) return null;
  return files[name][0];
}

function unlinkSafe(p) {
  try {
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  } catch (_) {}
}

function collectMulterPaths(files) {
  const paths = [];
  if (!files) return paths;
  Object.values(files).forEach((arr) => {
    (arr || []).forEach((f) => {
      if (f?.path) paths.push(f.path);
    });
  });
  return paths;
}

exports.createSubmission = async (req, res) => {
  const pathsToClean = collectMulterPaths(req.files);
  try {
    let payload;
    try {
      payload =
        typeof req.body.payload === 'string' ? JSON.parse(req.body.payload) : req.body.payload;
    } catch (e) {
      pathsToClean.forEach(unlinkSafe);
      return res.status(400).json({ message: 'Invalid JSON in payload field' });
    }

    const files = req.files || {};
    const profile = pickFile(files, 'profilePhoto');
    const idFront = pickFile(files, 'idFront');
    const idBack = pickFile(files, 'idBack');
    const signature = pickFile(files, 'signature');
    const parts = {
      profilePhoto: profile ? { path: profile.path } : undefined,
      idFront: idFront ? { path: idFront.path } : undefined,
      idBack: idBack ? { path: idBack.path } : undefined,
      signature: signature ? { path: signature.path } : undefined,
    };

    const result = await createSubmissionCore(payload, parts);

    pathsToClean.forEach(unlinkSafe);

    res.status(201).json(result);
  } catch (error) {
    pathsToClean.forEach(unlinkSafe);
    const status = error.statusCode || 500;
    console.error('createSubmission', error);
    if (status === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: 'Submission failed',
      error: process.env.NODE_ENV === 'development' ? String(error?.message || error) : undefined,
    });
  }
};
