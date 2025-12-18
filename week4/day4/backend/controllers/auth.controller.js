const { generateToken } = require('../middleware/auth');

// Admin wallet addresses (in real app, store in database)
const ADMIN_WALLETS = [
  '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e416', // Main admin
  '0x8ba1f109551bD432803012645Hac136c22C501e',  // Secondary admin
];

// Determine user role based on wallet address
const getUserRole = (walletAddress) => {
  if (ADMIN_WALLETS.includes(walletAddress)) {
    return 'admin';
  }
  return 'user';
};

// Simulate wallet connection
const connectWallet = (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and signature required'
      });
    }
    
    // Determine user role
    const role = getUserRole(walletAddress);
    const userId = `user_${walletAddress.slice(-8)}`;
    const token = generateToken(userId, walletAddress, role);
    
    res.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        token,
        user: {
          id: userId,
          walletAddress,
          role,
          votingPower: role === 'admin' ? 1000 : Math.floor(Math.random() * 100) + 1,
          isAdmin: role === 'admin'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error connecting wallet'
    });
  }
};

const getUserProfile = (req, res) => {
  try {
    const { user } = req;
    
    res.json({
      success: true,
      data: {
        userId: user.userId,
        walletAddress: user.walletAddress,
        votingPower: Math.floor(Math.random() * 100) + 1,
        memberSince: new Date('2024-01-01'),
        totalVotesCast: Math.floor(Math.random() * 50)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

module.exports = { connectWallet, getUserProfile };