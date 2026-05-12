const mongoose = require('mongoose');

const imageUrlsSchema = new mongoose.Schema(
  {
    profilePhoto: { type: String, default: null },
    idFront: { type: String, default: null },
    idBack: { type: String, default: null },
    signature: { type: String, default: null },
  },
  { _id: false }
);

const stepperSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, index: true },
    submittedAt: { type: Date, required: true },
    accountType: { type: String, default: '' },
    organization: { type: mongoose.Schema.Types.Mixed, default: {} },
    address: { type: mongoose.Schema.Types.Mixed, default: {} },
    roles: { type: mongoose.Schema.Types.Mixed, default: {} },
    compliance: { type: mongoose.Schema.Types.Mixed, default: {} },
    review: { type: mongoose.Schema.Types.Mixed, default: {} },
    riskScore: { type: Number, default: 0 },
    imageUrls: { type: imageUrlsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stepper', stepperSchema);
