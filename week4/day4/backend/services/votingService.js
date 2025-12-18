const { proposals } = require('../data/proposals');

class VotingService {
  static voteHistory = new Map(); // userId -> [votes]
  
  static hasUserVoted(userId, proposalId) {
    const userVotes = this.voteHistory.get(userId) || [];
    return userVotes.some(vote => vote.proposalId === proposalId);
  }
  
  static recordVote(userId, proposalId, vote) {
    if (!this.voteHistory.has(userId)) {
      this.voteHistory.set(userId, []);
    }
    
    this.voteHistory.get(userId).push({
      proposalId,
      vote,
      timestamp: new Date(),
      blockNumber: Math.floor(Math.random() * 1000000) // Simulate blockchain
    });
  }
  
  static getUserVotes(userId) {
    return this.voteHistory.get(userId) || [];
  }
  
  static getProposalStats(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return null;
    
    const totalVotes = proposal.totalVotes;
    const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes * 100).toFixed(2) : 0;
    const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes * 100).toFixed(2) : 0;
    const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes * 100).toFixed(2) : 0;
    
    return {
      ...proposal,
      statistics: {
        yesPercentage: parseFloat(yesPercentage),
        noPercentage: parseFloat(noPercentage),
        abstainPercentage: parseFloat(abstainPercentage),
        participationRate: (totalVotes / 1000 * 100).toFixed(2) // Assuming 1000 total eligible voters
      }
    };
  }
  
  static getQuorumStatus(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return null;
    
    const requiredQuorum = 100; // Minimum votes needed
    const hasQuorum = proposal.totalVotes >= requiredQuorum;
    
    return {
      hasQuorum,
      currentVotes: proposal.totalVotes,
      requiredVotes: requiredQuorum,
      percentage: (proposal.totalVotes / requiredQuorum * 100).toFixed(2)
    };
  }
}

module.exports = VotingService;