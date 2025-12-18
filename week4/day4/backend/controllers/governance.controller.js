const Proposal = require('../models/ProposalSchema');
const Vote = require('../models/VoteSchema');
const User = require('../models/UserSchema');
const BlockchainSimulator = require('../utils/blockchain');

const getGovernanceStats = async (req, res) => {
  try {
    // Get real data from database
    const totalProposals = await Proposal.countDocuments();
    const activeProposals = await Proposal.countDocuments({ status: 'active' });
    const totalVotes = await Vote.countDocuments();
    const totalParticipants = await User.countDocuments();
    
    // Calculate average participation
    const averageParticipation = totalProposals > 0 
      ? ((totalVotes / totalProposals) * 100) 
      : 0;
    
    res.json({
      success: true,
      data: {
        totalProposals,
        activeProposals,
        totalVotes,
        totalParticipants,
        averageParticipation,
        currentBlock: BlockchainSimulator.getCurrentBlockNumber(),
        networkGasFee: BlockchainSimulator.calculateGasFee()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching governance statistics'
    });
  }
};

const executeProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await GovernanceService.executeProposal(parseInt(id));
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    res.json({
      success: result.success,
      message: result.message,
      data: result.success ? {
        executionHash: result.executionHash,
        blockNumber: BlockchainSimulator.getCurrentBlockNumber(),
        gasFee: BlockchainSimulator.calculateGasFee()
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error executing proposal'
    });
  }
};

const getDelegationInfo = (req, res) => {
  try {
    const { walletAddress } = req.params;
    const delegationInfo = GovernanceService.getDelegationInfo(walletAddress);
    
    res.json({
      success: true,
      data: delegationInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delegation information'
    });
  }
};

const getProposalTimeline = (req, res) => {
  try {
    const { id } = req.params;
    const timeline = GovernanceService.getProposalTimeline(parseInt(id));
    
    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }
    
    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching proposal timeline'
    });
  }
};

module.exports = {
  getGovernanceStats,
  executeProposal,
  getDelegationInfo,
  getProposalTimeline
};