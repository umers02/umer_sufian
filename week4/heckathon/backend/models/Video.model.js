const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  genre: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  director: { type: String },
  cast: [{ type: String }],
  rating: { type: Number, min: 0, max: 10, default: 0 },
  language: { type: String, default: 'English' },
  quality: { type: String, enum: ['HD', 'FHD', '4K'], default: 'HD' },
  type: { type: String, enum: ['movie', 'series', 'documentary'], default: 'movie' },
  isPremium: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);