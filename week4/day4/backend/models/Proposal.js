class Proposal {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'active';
    this.votes = data.votes || { yes: 0, no: 0, abstain: 0 };
    this.totalVotes = data.totalVotes || 0;
    this.endDate = data.endDate;
    this.createdAt = data.createdAt || new Date();
    this.proposer = data.proposer || 'DAO Treasury';
    this.category = data.category || 'governance';
    this.requiredQuorum = data.requiredQuorum || 100;
    this.executionDelay = data.executionDelay || 48; // hours
  }

  getVotePercentages() {
    if (this.totalVotes === 0) {
      return { yes: 0, no: 0, abstain: 0 };
    }
    return {
      yes: ((this.votes.yes / this.totalVotes) * 100).toFixed(2),
      no: ((this.votes.no / this.totalVotes) * 100).toFixed(2),
      abstain: ((this.votes.abstain / this.totalVotes) * 100).toFixed(2)
    };
  }

  hasQuorum() {
    return this.totalVotes >= this.requiredQuorum;
  }

  isPassing() {
    return this.votes.yes > this.votes.no && this.hasQuorum();
  }

  getTimeRemaining() {
    const now = new Date();
    const end = new Date(this.endDate);
    const diff = end - now;
    
    if (diff <= 0) return { expired: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { expired: false, days, hours, totalHours: Math.floor(diff / (1000 * 60 * 60)) };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      votes: this.votes,
      totalVotes: this.totalVotes,
      votePercentages: this.getVotePercentages(),
      endDate: this.endDate,
      timeRemaining: this.getTimeRemaining(),
      createdAt: this.createdAt,
      proposer: this.proposer,
      category: this.category,
      quorum: {
        required: this.requiredQuorum,
        current: this.totalVotes,
        achieved: this.hasQuorum(),
        percentage: ((this.totalVotes / this.requiredQuorum) * 100).toFixed(2)
      },
      isPassing: this.isPassing(),
      executionDelay: this.executionDelay
    };
  }
}

module.exports = Proposal;