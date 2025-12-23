const express = require('express');
const { getAllUsers, getUserById, blockUser, unblockUser, updateUser, deleteUser } = require('../controllers/admin/adminUser.controller');
const { getAllVideos, createVideo, updateVideo, deleteVideo, hideVideo, showVideo, upload: videoUpload } = require('../controllers/admin/adminVideo.controller');
const { getAllPlans, createPlan, updatePlan, deletePlan } = require('../controllers/admin/adminPlan.controller');
const { addMovie, getAllMovies, getMovie, updateMovie, deleteMovie, getDashboardStats } = require('../controllers/admin/adminMovie.controller');
const { addManualMovie, getAllMoviesCombined, getMovieCombined, updateManualMovie, deleteManualMovie } = require('../controllers/admin/adminManualMovie.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin', 'superadmin']));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Video management
router.get('/videos', getAllVideos);
router.post('/videos', videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createVideo);
router.put('/videos/:id', updateVideo);
router.put('/videos/:id/hide', hideVideo);
router.put('/videos/:id/show', showVideo);
router.delete('/videos/:id', deleteVideo);

// Plan management
router.get('/plans', getAllPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// TMDB Movie management
router.post('/movies/tmdb', addMovie);
router.get('/movies/tmdb', getAllMovies);
router.get('/movies/tmdb/:id', getMovie);
router.put('/movies/tmdb/:id', updateMovie);
router.delete('/movies/tmdb/:id', deleteMovie);

// Manual Movie management
router.post('/movies/manual', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'backdrop', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), addManualMovie);
router.put('/movies/manual/:id', upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'backdrop', maxCount: 1 },
  { name: 'trailer', maxCount: 1 }
]), updateManualMovie);
router.delete('/movies/manual/:id', deleteManualMovie);

// Combined Movies API
router.get('/movies', getAllMoviesCombined);
router.get('/movies/:id', getMovieCombined);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;