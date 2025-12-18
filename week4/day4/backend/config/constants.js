const PROPOSAL_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PASSED: 'passed',
  FAILED: 'failed',
  EXECUTED: 'executed',
  CANCELLED: 'cancelled'
};

const VOTE_OPTIONS = {
  YES: 'yes',
  NO: 'no',
  ABSTAIN: 'abstain'
};

const PROPOSAL_CATEGORIES = {
  GOVERNANCE: 'governance',
  TREASURY: 'treasury',
  TECHNICAL: 'technical',
  COMMUNITY: 'community',
  EMERGENCY: 'emergency'
};

const VOTING_PERIODS = {
  STANDARD: 7 * 24 * 60 * 60 * 1000, // 7 days
  EMERGENCY: 24 * 60 * 60 * 1000,    // 1 day
  EXTENDED: 14 * 24 * 60 * 60 * 1000  // 14 days
};

const QUORUM_REQUIREMENTS = {
  GOVERNANCE: 1000,
  TREASURY: 1500,
  TECHNICAL: 500,
  COMMUNITY: 300,
  EMERGENCY: 2000
};

const API_RESPONSES = {
  SUCCESS: {
    VOTE_CAST: 'Vote cast successfully',
    PROPOSAL_CREATED: 'Proposal created successfully',
    WALLET_CONNECTED: 'Wallet connected successfully'
  },
  ERROR: {
    PROPOSAL_NOT_FOUND: 'Proposal not found',
    ALREADY_VOTED: 'You have already voted on this proposal',
    VOTING_CLOSED: 'Voting period has ended',
    INSUFFICIENT_POWER: 'Insufficient voting power',
    INVALID_SIGNATURE: 'Invalid wallet signature'
  }
};

module.exports = {
  PROPOSAL_STATUS,
  VOTE_OPTIONS,
  PROPOSAL_CATEGORIES,
  VOTING_PERIODS,
  QUORUM_REQUIREMENTS,
  API_RESPONSES
};