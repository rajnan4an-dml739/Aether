const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safe = String(file.originalname || 'upload').replace(/[^\w.-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
});
