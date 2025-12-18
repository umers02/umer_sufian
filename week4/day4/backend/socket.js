const { proposals } = require('./data/proposals');
const Proposal = require('./models/Proposal');
const BlockchainSimulator = require('./utils/blockchain');
const GovernanceService = require('./services/governanceService');

module.exports = (io) => {
  let connectedUsers = new Map();
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Send current proposals with enhanced data
    const enhancedProposals = proposals.map(p => new Proposal(p).toJSON());
    socket.emit('proposals:update', enhancedProposals);
    
    // Send governance stats
    socket.emit('governance:stats', GovernanceService.getGovernanceStats());
    
    // Handle user registration
    socket.on('user:register', (userData) => {
      connectedUsers.set(socket.id, userData);
      io.emit('governance:activeUsers', connectedUsers.size);
    });
    
    // Handle vote casting with blockchain simulation
    socket.on('vote:cast', (data) => {
      const { proposalId, vote, walletAddress, signature } = data;
      
      const proposal = proposals.find(p => p.id === parseInt(proposalId));
      
      if (proposal && proposal.status === 'active' && ['yes', 'no', 'abstain'].includes(vote)) {
        // Simulate blockchain verification
        if (BlockchainSimulator.verifySignature('vote', signature, walletAddress)) {
          const votingPower = BlockchainSimulator.getVotingPower(walletAddress);
          
          // Update vote count with voting power
          proposal.votes[vote] += votingPower;
          proposal.totalVotes += votingPower;
          
          // Create blockchain transaction
          const transaction = BlockchainSimulator.createVoteTransaction(proposalId, vote, walletAddress);
          
          // Enhanced proposal data
          const proposalModel = new Proposal(proposal);
          
          // Broadcast to all clients
          io.emit('vote:updated', {
            proposalId: proposal.id,
            proposal: proposalModel.toJSON(),
            transaction,
            voter: walletAddress,
            votingPower,
            timestamp: new Date()
          });
          
          // Send confirmation to voter
          socket.emit('vote:confirmed', {
            proposalId: proposal.id,
            vote,
            transaction,
            votingPower,
            message: 'Vote cast successfully on blockchain'
          });
          
          // Check if proposal can be executed
          if (proposalModel.isPassing() && proposalModel.hasQuorum()) {
            io.emit('proposal:executable', {
              proposalId: proposal.id,
              message: 'Proposal is now ready for execution'
            });
          }
        } else {
          socket.emit('vote:error', {
            message: 'Invalid signature verification failed'
          });
        }
      } else {
        socket.emit('vote:error', {
          message: 'Invalid vote or proposal not found'
        });
      }
    });
    
    // Handle proposal execution events
    socket.on('proposal:execute', async (data) => {
      const { proposalId } = data;
      const result = await GovernanceService.executeProposal(proposalId);
      
      if (result.success) {
        io.emit('proposal:executed', {
          proposalId,
          executionHash: result.executionHash,
          timestamp: new Date()
        });
        // Broadcast updated proposals and stats
        const enhancedProposals = proposals.map(p => new Proposal(p).toJSON());
        io.emit('proposals:update', enhancedProposals);
        io.to('governance-updates').emit('governance:stats', GovernanceService.getGovernanceStats());
      } else {
        socket.emit('proposal:execute:error', { message: result.message });
      }
    });

    // Handle admin management actions (close voting, cancel, execute)
    socket.on('proposal:manage', async (data) => {
      try {
        console.log('proposal:manage received', data)
        const { proposalId, action } = data;

        // Try numericId from the payload first (explicit numeric id). If not provided, only treat
        // proposalId as numeric when it contains only digits (to avoid parsing ObjectId-like strings)
        const numericId = data && data.numericId
          ? parseInt(data.numericId)
          : (typeof proposalId === 'string' && /^\d+$/.test(proposalId) ? parseInt(proposalId) : NaN)

        if (!isNaN(numericId)) {
          const proposal = proposals.find(p => p.id === numericId);
          if (!proposal) {
            socket.emit('proposal:manage:error', { message: 'Proposal not found' });
            return;
          }

          if (action === 'close') {
            const proposalModel = new Proposal(proposal);
            proposal.status = (proposalModel.isPassing() && proposalModel.hasQuorum()) ? 'passed' : 'failed';
            io.emit('proposal:closed', { proposalId: proposal.id, status: proposal.status });
          } else if (action === 'cancel') {
            proposal.status = 'cancelled';
            io.emit('proposal:cancelled', { proposalId: proposal.id });
          } else if (action === 'execute') {
            const result = await GovernanceService.executeProposal(proposal.id);
            if (result.success) {
              io.emit('proposal:executed', {
                proposalId: proposal.id,
                executionHash: result.executionHash,
                timestamp: new Date()
              });
            } else {
              socket.emit('proposal:manage:error', { message: result.message });
            }
          }

          // Broadcast updated proposals and stats (in-memory)
          const enhancedProposals = proposals.map(p => new Proposal(p).toJSON());
          io.emit('proposals:update', enhancedProposals);
          io.to('governance-updates').emit('governance:stats', GovernanceService.getGovernanceStats());
          return;
        }

        // If not numeric, assume MongoDB ObjectId string and update DB-backed proposals
        // Lazy require to avoid circular issues
        const ProposalModel = require('./models/ProposalSchema');
        const UserModel = require('./models/UserSchema');

        let proposalDoc = await ProposalModel.findById(proposalId);

        // If not found in DB, try to match against in-memory proposals by numeric id strings
        if (!proposalDoc) {
          const inMemoryMatch = proposals.find(p => String(p.id) === String(proposalId) || String(p._id) === String(proposalId));
          if (inMemoryMatch) {
            console.warn('proposal:manage - incoming id looked like ObjectId but matched in-memory proposal; applying in-memory update', proposalId);

            if (action === 'close') {
              const proposalModel = new Proposal(inMemoryMatch);
              inMemoryMatch.status = (proposalModel.isPassing() && proposalModel.hasQuorum()) ? 'passed' : 'failed';
              io.emit('proposal:closed', { proposalId: inMemoryMatch.id, status: inMemoryMatch.status });
            } else if (action === 'cancel') {
              inMemoryMatch.status = 'cancelled';
              io.emit('proposal:cancelled', { proposalId: inMemoryMatch.id });
            } else if (action === 'execute') {
              const result = await GovernanceService.executeProposal(inMemoryMatch.id);
              if (result.success) {
                io.emit('proposal:executed', {
                  proposalId: inMemoryMatch.id,
                  executionHash: result.executionHash,
                  timestamp: new Date()
                });
              } else {
                socket.emit('proposal:manage:error', { message: result.message });
                return;
              }
            }

            const enhancedProposals = proposals.map(p => new Proposal(p).toJSON());
            io.emit('proposals:update', enhancedProposals);
            io.to('governance-updates').emit('governance:stats', GovernanceService.getGovernanceStats());
            return;
          }

          socket.emit('proposal:manage:error', { message: 'Proposal not found' });
          return;
        }

        if (action === 'close') {
          const hasQuorum = proposalDoc.totalVotes >= (proposalDoc.requiredQuorum || 0);
          const isPassing = (proposalDoc.votes && proposalDoc.votes.yes > (proposalDoc.votes.no || 0)) && hasQuorum;
          proposalDoc.status = isPassing ? 'passed' : 'failed';
          await proposalDoc.save();
          io.emit('proposal:closed', { proposalId: proposalDoc._id, status: proposalDoc.status });
        } else if (action === 'cancel') {
          proposalDoc.status = 'cancelled';
          await proposalDoc.save();
          io.emit('proposal:cancelled', { proposalId: proposalDoc._id });
        } else if (action === 'execute') {
          const hasQuorum = proposalDoc.totalVotes >= (proposalDoc.requiredQuorum || 0);
          const isPassing = (proposalDoc.votes && proposalDoc.votes.yes > (proposalDoc.votes.no || 0)) && hasQuorum;
          if (!isPassing) {
            socket.emit('proposal:manage:error', { message: 'Proposal does not meet execution requirements' });
            return;
          }
          proposalDoc.status = 'executed';
          proposalDoc.executedAt = new Date();
          await proposalDoc.save();
          io.emit('proposal:executed', { proposalId: proposalDoc._id, executionHash: '0x' + Math.random().toString(16).slice(2), timestamp: new Date() });
        }

        // Broadcast updated proposals and compute stats from DB
        const allProposals = await ProposalModel.find().sort({ createdAt: -1 });
        io.emit('proposals:update', allProposals);

        const totalProposals = await ProposalModel.countDocuments();
        const activeProposals = await ProposalModel.countDocuments({ status: 'active' });
        const totalVotes = allProposals.reduce((sum, p) => sum + (p.totalVotes || 0), 0);
        const totalParticipants = await UserModel.countDocuments();
        const averageParticipation = totalProposals > 0 ? ((totalVotes / totalProposals) * 100) : 0;

        io.to('governance-updates').emit('governance:stats', {
          totalProposals,
          activeProposals,
          totalVotes,
          totalParticipants,
          averageParticipation
        });
      } catch (err) {
        console.error('proposal:manage error', err);
        socket.emit('proposal:manage:error', { message: 'Internal server error' });
      }
    });
    
    // Real-time governance updates
    socket.on('governance:subscribe', () => {
      socket.join('governance-updates');
    });
    
    // Handle real-time proposal updates
    socket.on('proposals:request', () => {
      const enhancedProposals = proposals.map(p => new Proposal(p).toJSON());
      socket.emit('proposals:update', enhancedProposals);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      connectedUsers.delete(socket.id);
      io.emit('governance:activeUsers', connectedUsers.size);
    });
  });
  
  // Periodic updates
  setInterval(() => {
    const stats = GovernanceService.getGovernanceStats();
    io.to('governance-updates').emit('governance:stats', stats);
  }, 30000); // Every 30 seconds
};