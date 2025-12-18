const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'passed', 'failed', 'executed', 'cancelled'],
    default: 'active'
  },
  votes: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    abstain: { type: Number, default: 0 }
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  endDate: {
    type: Date,
    required: true
  },
  proposer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['governance', 'treasury', 'technical', 'community', 'emergency'],
    default: 'governance'
  },
  requiredQuorum: {
    type: Number,
    default: 100
  },
  executionDelay: {
    type: Number,
    default: 48
  },
  executedAt: {
    type: Date
  },
  executionHash: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual for vote percentages
proposalSchema.virtual('votePercentages').get(function() {
  if (this.totalVotes === 0) {
    return { yes: 0, no: 0, abstain: 0 };
  }
  return {
    yes: ((this.votes.yes / this.totalVotes) * 100).toFixed(2),
    no: ((this.votes.no / this.totalVotes) * 100).toFixed(2),
    abstain: ((this.votes.abstain / this.totalVotes) * 100).toFixed(2)
  };
});

// Virtual for quorum status
proposalSchema.virtual('hasQuorum').get(function() {
  return this.totalVotes >= this.requiredQuorum;
});

// Virtual for passing status
proposalSchema.virtual('isPassing').get(function() {
  return this.votes.yes > this.votes.no && this.hasQuorum;
});

proposalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal', proposalSchema);