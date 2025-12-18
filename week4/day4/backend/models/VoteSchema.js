const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  vote: {
    type: String,
    enum: ['yes', 'no', 'abstain'],
    required: true
  },
  votingPower: {
    type: Number,
    required: true,
    min: 1
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  gasFee: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent double voting
voteSchema.index({ proposalId: 1, walletAddress: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);