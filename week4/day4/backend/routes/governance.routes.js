const express = require('express');
const router = express.Router();
const {
  getGovernanceStats,
  executeProposal,
  getDelegationInfo,
  getProposalTimeline
} = require('../controllers/governance.controller');
const { authenticateToken } = require('../middleware/auth');
const { apiRateLimit } = require('../middleware/rateLimit');

// Apply rate limiting
router.use(apiRateLimit);

// GET /api/governance/stats - Get governance statistics
router.get('/stats', getGovernanceStats);

// POST /api/governance/proposals/:id/execute - Execute proposal (protected)
router.post('/proposals/:id/execute', authenticateToken, executeProposal);

// GET /api/governance/delegation/:walletAddress - Get delegation info
router.get('/delegation/:walletAddress', getDelegationInfo);

// GET /api/governance/proposals/:id/timeline - Get proposal timeline
router.get('/proposals/:id/timeline', getProposalTimeline);

module.exports = router;