const express = require('express');
const router = express.Router();
const { connectWallet, getUserProfile } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/connect - Connect wallet
router.post('/connect', connectWallet);

// GET /api/auth/profile - Get user profile (protected)
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;