const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  poster_path: String,
  backdrop_path: String,
  release_date: String,
  vote_average: Number,
  vote_count: Number,
  genre_ids: [Number],
  original_language: String,
  popularity: Number,
  adult: Boolean,
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
