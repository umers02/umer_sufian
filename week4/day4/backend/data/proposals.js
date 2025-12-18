let proposals = [
  {
    id: 1,
    title: "Increase Block Size Limit",
    description: "Proposal to increase the maximum block size from 1MB to 2MB to improve transaction throughput and reduce network congestion.",
    status: "active",
    votes: { yes: 145, no: 23, abstain: 12 },
    totalVotes: 180,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-15'),
    proposer: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416",
    category: "technical",
    requiredQuorum: 500,
    executionDelay: 48
  },
  {
    id: 2,
    title: "Implement Staking Rewards Program",
    description: "Introduce a comprehensive staking mechanism with 5% annual rewards for token holders who lock their tokens for minimum 30 days. This will increase network security and token utility.",
    status: "active",
    votes: { yes: 267, no: 45, abstain: 18 },
    totalVotes: 330,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-10'),
    proposer: "0x8ba1f109551bD432803012645Hac136c22C501e",
    category: "governance",
    requiredQuorum: 1000,
    executionDelay: 72
  },
  {
    id: 3,
    title: "Treasury Fund Allocation for Ecosystem Growth",
    description: "Allocate 20% of treasury funds (approximately $2M) for ecosystem development, community grants program, and strategic partnerships to accelerate adoption.",
    status: "active",
    votes: { yes: 834, no: 128, abstain: 88 },
    totalVotes: 1050,
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-12'),
    proposer: "DAO Treasury Committee",
    category: "treasury",
    requiredQuorum: 1500,
    executionDelay: 96
  },
  {
    id: 4,
    title: "Emergency Security Patch Implementation",
    description: "Deploy critical security patch to address potential vulnerability in smart contract. Immediate action required to protect user funds.",
    status: "active",
    votes: { yes: 1456, no: 23, abstain: 45 },
    totalVotes: 1524,
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-18'),
    proposer: "Security Council",
    category: "emergency",
    requiredQuorum: 2000,
    executionDelay: 12
  }
];

module.exports = { proposals };