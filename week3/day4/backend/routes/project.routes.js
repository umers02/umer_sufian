const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getStats
} = require('../controllers/project.controller');
const { protect } = require('../middleware/authMiddleware');
const { projectValidation } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);

router.route('/')
  .get(getAllProjects)
  .post(projectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
