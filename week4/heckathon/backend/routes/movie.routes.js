const express = require('express');
const router = express.Router();
const {
  addMovie,
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getDashboardStats
} = require('../controllers/admin/adminMovie.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Public routes
router.get('/', getAllMovies);
router.get('/:id', getMovie);

// Admin routes
router.post('/', authenticate, authorize(['admin', 'superadmin']), addMovie);
router.put('/:id', authenticate, authorize(['admin', 'superadmin']), updateMovie);
router.delete('/:id', authenticate, authorize(['admin', 'superadmin']), deleteMovie);
router.get('/admin/dashboard-stats', authenticate, authorize(['admin', 'superadmin']), getDashboardStats);

module.exports = router;