const express = require('express');
const router = express.Router();
const { 
  getAllProposals, 
  getProposal, 
  castVote,
  createProposal,
  manageProposal, 
  getProposalWithStats, 
  getUserVotes 
} = require('../controllers/proposal.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { voteRateLimit, apiRateLimit } = require('../middleware/rateLimit');
const { validateVote, validateProposalId } = require('../middleware/validation');

// Apply rate limiting to all routes
router.use(apiRateLimit);

// GET /api/proposals - Get all proposals
router.get('/', getAllProposals);

// POST /api/proposals - Create new proposal (Admin only)
router.post('/', authenticateToken, requireAdmin, createProposal);

// GET /api/proposals/:id - Get single proposal
router.get('/:id', validateProposalId, getProposal);

// GET /api/proposals/:id/stats - Get proposal with detailed statistics
router.get('/:id/stats', validateProposalId, getProposalWithStats);

// POST /api/proposals/:id/vote - Cast vote on proposal (with rate limiting)
router.post('/:id/vote', voteRateLimit, authenticateToken, validateVote, castVote);

// POST /api/proposals/:id/manage - Admin manage proposal
router.post('/:id/manage', authenticateToken, requireAdmin, manageProposal);

// GET /api/proposals/user/:walletAddress/votes - Get user's voting history
router.get('/user/:walletAddress/votes', getUserVotes);

module.exports = router;