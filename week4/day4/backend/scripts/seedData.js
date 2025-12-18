const mongoose = require('mongoose');
const Proposal = require('../models/ProposalSchema');
require('dotenv').config();

const seedProposals = [
  {
    title: "Increase Block Size Limit",
    description: "Proposal to increase the maximum block size from 1MB to 2MB to improve transaction throughput and reduce network congestion.",
    status: "active",
    votes: { yes: 145, no: 23, abstain: 12 },
    totalVotes: 180,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    proposer: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416",
    category: "technical",
    requiredQuorum: 500,
    executionDelay: 48
  },
  {
    title: "Implement Staking Rewards Program",
    description: "Introduce a comprehensive staking mechanism with 5% annual rewards for token holders who lock their tokens for minimum 30 days.",
    status: "active",
    votes: { yes: 267, no: 45, abstain: 18 },
    totalVotes: 330,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    proposer: "0x8ba1f109551bD432803012645Hac136c22C501e",
    category: "governance",
    requiredQuorum: 1000,
    executionDelay: 72
  },
  {
    title: "Treasury Fund Allocation for Ecosystem Growth",
    description: "Allocate 20% of treasury funds (approximately $2M) for ecosystem development and community grants.",
    status: "active",
    votes: { yes: 834, no: 128, abstain: 88 },
    totalVotes: 1050,
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    proposer: "DAO Treasury Committee",
    category: "treasury",
    requiredQuorum: 1500,
    executionDelay: 96
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/governance-system');
    
    // Clear existing proposals
    await Proposal.deleteMany({});
    
    // Insert seed data
    await Proposal.insertMany(seedProposals);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();