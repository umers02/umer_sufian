const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  features: [{ type: String }],
  maxDevices: { type: Number, default: 1 },
  videoQuality: { type: String, enum: ['HD', 'FHD', '4K'], default: 'HD' },
  downloadAllowed: { type: Boolean, default: false },
  adsSupported: { type: Boolean, default: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);