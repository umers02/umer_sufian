const mongoose = require('mongoose');

const manualMovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  poster_path: String, // Cloudinary URL
  backdrop_path: String, // Cloudinary URL
  trailer_url: String, // Cloudinary video URL
  release_date: String,
  vote_average: {
    type: Number,
    default: 0
  },
  vote_count: {
    type: Number,
    default: 0
  },
  genres: [{
    id: Number,
    name: String
  }],
  spoken_languages: [{
    iso_639_1: String,
    name: String
  }],
  runtime: Number,
  status: {
    type: String,
    default: 'Released'
  },
  cast: [{
    name: String,
    character: String,
    profile_path: String
  }],
  isManual: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ManualMovie', manualMovieSchema);