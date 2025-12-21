const express = require('express');
const router = express.Router();
const {
  getPlans,
  startFreeTrial,
  subscribeToPlan,
  getUserSubscription,
  cancelSubscription
} = require('../controllers/user/userSubscription.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.post('/free-trial', authenticate, startFreeTrial);
router.post('/subscribe', authenticate, subscribeToPlan);
router.get('/my-subscription', authenticate, getUserSubscription);
router.post('/cancel', authenticate, cancelSubscription);

module.exports = router;