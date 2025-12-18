const Proposal = require('../models/ProposalSchema');
const Vote = require('../models/VoteSchema');
const User = require('../models/UserSchema');
const BlockchainSimulator = require('../utils/blockchain');

// Get all proposals
const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching proposals'
    });
  }
};

// Get single proposal
const getProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching proposal'
    });
  }
};

// Cast vote with database persistence
const castVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote, walletAddress, signature } = req.body;
    
    const proposal = await Proposal.findById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    if (proposal.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Voting is closed for this proposal'
      });
    }
    
    // Check if user already voted
    const existingVote = await Vote.findOne({ proposalId: id, walletAddress });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this proposal'
      });
    }
    
    // Get or create user
    let user = await User.findOne({ walletAddress });
    if (!user) {
      // Determine voting power based on role
      const votingPower = walletAddress === '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416' 
        ? 1000 
        : Math.floor(Math.random() * 100) + 1;
        
      user = new User({
        walletAddress,
        votingPower
      });
      await user.save();
    }
    
    // Create blockchain transaction
    const transaction = BlockchainSimulator.createVoteTransaction(id, vote, walletAddress);
    
    // Save vote to database
    const newVote = new Vote({
      proposalId: id,
      walletAddress,
      vote,
      votingPower: user.votingPower,
      transactionHash: transaction.hash,
      blockNumber: transaction.blockNumber,
      gasFee: transaction.gasFee,
      signature
    });
    
    await newVote.save();
    
    // Update proposal vote counts (1 vote per person)
    proposal.votes[vote] += 1;
    proposal.totalVotes += 1;
    await proposal.save();
    
    // Update user stats
    user.totalVotesCast += 1;
    user.lastActiveAt = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: 'Vote cast successfully',
      data: {
        proposal,
        transaction,
        votingPower: user.votingPower
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error casting vote'
    });
  }
};

// Get proposal with statistics
const getProposalWithStats = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    const votes = await Vote.find({ proposalId: id });
    
    res.json({
      success: true,
      data: {
        proposal,
        voteDetails: votes,
        totalVoters: votes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching proposal statistics'
    });
  }
};

// Get user's voting history
const getUserVotes = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const votes = await Vote.find({ walletAddress })
      .populate('proposalId', 'title status')
      .sort({ createdAt: -1 });
    
    const user = await User.findOne({ walletAddress });
    
    res.json({
      success: true,
      data: {
        votes,
        user,
        totalVotes: votes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user votes'
    });
  }
};

// Create new proposal (Admin only)
const createProposal = async (req, res) => {
  try {
    const { title, description, category, endDate, executionDelay } = req.body;
    const { walletAddress } = req.user;
    
    // Validate required fields
    if (!title || !description || !category || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Create new proposal
    const newProposal = new Proposal({
      title,
      description,
      category,
      endDate: new Date(endDate),
      proposer: walletAddress,
      executionDelay: executionDelay || 48,
      status: 'active',
      votes: { yes: 0, no: 0, abstain: 0 },
      totalVotes: 0,
      requiredQuorum: category === 'emergency' ? 2000 : 1000
    });
    
    await newProposal.save();
    
    res.status(201).json({
      success: true,
      message: 'Proposal created successfully',
      data: newProposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating proposal'
    });
  }
};

// Admin management functions
const manageProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    
    const proposal = await Proposal.findById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    switch (action) {
      case 'close':
        proposal.status = 'failed';
        await proposal.save();
        break;
        
      case 'execute':
        if (proposal.status !== 'passed') {
          proposal.status = 'passed'; // Auto-pass for admin
        }
        proposal.status = 'executed';
        proposal.executedAt = new Date();
        proposal.executionHash = '0x' + Math.random().toString(16).substr(2, 64);
        await proposal.save();
        break;
        
      case 'cancel':
        proposal.status = 'cancelled';
        await proposal.save();
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }
    
    res.json({
      success: true,
      message: `Proposal ${action}d successfully`,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error managing proposal'
    });
  }
};

module.exports = {
  getAllProposals,
  getProposal,
  castVote,
  createProposal,
  manageProposal,
  getProposalWithStats,
  getUserVotes
};