class BlockchainSimulator {
  static generateTransactionHash() {
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  static getCurrentBlockNumber() {
    return Math.floor(Math.random() * 1000000) + 18000000;
  }

  static calculateGasFee() {
    return (Math.random() * 0.01 + 0.005).toFixed(6); // ETH
  }

  static verifySignature(message, signature, address) {
    // Simulate signature verification
    return signature && address && signature.length > 50;
  }

  static getVotingPower(walletAddress) {
    // Simulate token-based voting power
    const hash = walletAddress.slice(-8);
    const power = parseInt(hash, 16) % 1000 + 1;
    return Math.min(power, 500); // Max 500 voting power
  }

  static createVoteTransaction(proposalId, vote, walletAddress) {
    return {
      hash: this.generateTransactionHash(),
      blockNumber: this.getCurrentBlockNumber(),
      from: walletAddress,
      to: '0xGovernanceContract',
      proposalId,
      vote,
      votingPower: this.getVotingPower(walletAddress),
      gasFee: this.calculateGasFee(),
      timestamp: new Date(),
      status: 'confirmed'
    };
  }
}

module.exports = BlockchainSimulator;