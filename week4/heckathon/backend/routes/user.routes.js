const express = require('express');
const { getProfile, updateProfile } = require('../controllers/user/userProfile.controller');
const { getUserSubscription, startFreeTrial, subscribeToPlan, cancelSubscription } = require('../controllers/user/userSubscription.controller');
const { getVideos, getVideoById, streamVideo } = require('../controllers/user/userStreaming.controller');
const { getAllMovies, getMovieDetails, getMoviesByGenre } = require('../controllers/user/userMovie.controller');
const Plan = require('../models/Plan.model');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validateCardDetails } = require('../middleware/validation.middleware');
const router = express.Router();

router.use(authenticate);
router.use(authorize(['user', 'admin', 'superAdmin']));

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subscription
router.get('/subscription', getUserSubscription);
router.post('/subscription/trial', startFreeTrial);
router.post('/subscription', subscribeToPlan);
router.delete('/subscription', cancelSubscription);

// Movies
router.get('/movies', getAllMovies);
router.get('/movies/:id', getMovieDetails);
router.get('/movies/genres/categories', getMoviesByGenre);

// Streaming
router.get('/videos', getVideos);
router.get('/videos/:id', getVideoById);
router.get('/stream/:id', streamVideo);

module.exports = router;