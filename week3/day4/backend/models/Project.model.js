const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
