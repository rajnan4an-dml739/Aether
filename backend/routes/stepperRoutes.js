const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { createSubmission } = require('../controllers/stepperController');

const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]);

router.post('/', uploadFields, createSubmission);

module.exports = router;
