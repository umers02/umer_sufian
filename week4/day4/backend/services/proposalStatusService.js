const Proposal = require('../models/ProposalSchema');

class ProposalStatusService {
  // Check and update expired proposals
  static async updateExpiredProposals() {
    try {
      const now = new Date();
      
      // Find all active proposals that have expired
      const expiredProposals = await Proposal.find({
        status: 'active',
        endDate: { $lt: now }
      });

      for (const proposal of expiredProposals) {
        const { yes, no, abstain } = proposal.votes;
        const totalVotes = yes + no + abstain;
        
        // Check if quorum is met
        const quorumMet = totalVotes >= proposal.requiredQuorum;
        
        let newStatus = 'failed'; // Default to failed
        
        if (quorumMet) {
          // If quorum met, check if yes votes > no votes
          if (yes > no) {
            newStatus = 'passed';
          } else {
            newStatus = 'failed';
          }
        } else {
          // Quorum not met = failed
          newStatus = 'failed';
        }
        
        // Update proposal status
        proposal.status = newStatus;
        await proposal.save();
        
        console.log(`Proposal ${proposal._id} updated to ${newStatus} (Yes: ${yes}, No: ${no}, Quorum: ${totalVotes}/${proposal.requiredQuorum})`);
      }
      
      return expiredProposals.length;
    } catch (error) {
      console.error('Error updating expired proposals:', error);
      return 0;
    }
  }

  // Start automatic checking every minute
  static startAutoCheck() {
    console.log('Starting automatic proposal status checker...');
    
    // Run immediately
    this.updateExpiredProposals();
    
    // Then run every minute
    setInterval(() => {
      this.updateExpiredProposals();
    }, 60000); // 60 seconds
  }
}

module.exports = ProposalStatusService;