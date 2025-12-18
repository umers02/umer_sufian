const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  votingPower: {
    type: Number,
    default: 1
  },
  totalVotesCast: {
    type: Number,
    default: 0
  },
  delegatedTo: {
    type: String,
    default: null
  },
  delegatedPower: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);