const { proposals } = require('../data/proposals');
const Proposal = require('../models/Proposal');
const BlockchainSimulator = require('../utils/blockchain');
const { PROPOSAL_STATUS, QUORUM_REQUIREMENTS, API_RESPONSES } = require('../config/constants');

class GovernanceService {
  static async executeProposal(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return null;

    const proposalModel = new Proposal(proposal);
    
    if (proposalModel.isPassing() && proposalModel.hasQuorum()) {
      proposal.status = PROPOSAL_STATUS.EXECUTED;
      proposal.executedAt = new Date();
      
      return {
        success: true,
        message: 'Proposal executed successfully',
        executionHash: BlockchainSimulator.generateTransactionHash()
      };
    }
    
    return {
      success: false,
      message: 'Proposal does not meet execution requirements'
    };
  }

  static getGovernanceStats() {
    const totalProposals = proposals.length;
    const activeProposals = proposals.filter(p => p.status === PROPOSAL_STATUS.ACTIVE).length;
    const passedProposals = proposals.filter(p => p.status === PROPOSAL_STATUS.PASSED).length;
    const totalVotes = proposals.reduce((sum, p) => sum + p.totalVotes, 0);
    
    return {
      totalProposals,
      activeProposals,
      passedProposals,
      totalVotes,
      averageParticipation: totalProposals > 0 ? (totalVotes / totalProposals).toFixed(2) : 0,
      governanceHealth: this.calculateGovernanceHealth()
    };
  }

  static calculateGovernanceHealth() {
    const activeCount = proposals.filter(p => p.status === PROPOSAL_STATUS.ACTIVE).length;
    const totalVotes = proposals.reduce((sum, p) => sum + p.totalVotes, 0);
    const avgVotes = proposals.length > 0 ? totalVotes / proposals.length : 0;
    
    let health = 'Low';
    if (activeCount >= 3 && avgVotes >= 50) health = 'High';
    else if (activeCount >= 2 && avgVotes >= 25) health = 'Medium';
    
    return health;
  }

  static getDelegationInfo(walletAddress) {
    return {
      delegatedTo: null,
      delegatedFrom: [],
      totalDelegatedPower: BlockchainSimulator.getVotingPower(walletAddress),
      canDelegate: true
    };
  }

  static getProposalTimeline(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return null;

    return {
      created: proposal.createdAt,
      votingStarted: proposal.createdAt,
      votingEnds: proposal.endDate,
      executionDelay: proposal.executionDelay || 48,
      estimatedExecution: new Date(new Date(proposal.endDate).getTime() + (48 * 60 * 60 * 1000))
    };
  }
}

module.exports = GovernanceService;