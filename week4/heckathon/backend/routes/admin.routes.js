const express = require('express');
const { getAllUsers, getUserById, blockUser, unblockUser, updateUser, deleteUser } = require('../controllers/admin/adminUser.controller');
const { getAllVideos, createVideo, updateVideo, deleteVideo, hideVideo, showVideo, upload } = require('../controllers/admin/adminVideo.controller');
const { getAllPlans, createPlan, updatePlan, deletePlan } = require('../controllers/admin/adminPlan.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin']));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Video management
router.get('/videos', getAllVideos);
router.post('/videos', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createVideo);
router.put('/videos/:id', updateVideo);
router.put('/videos/:id/hide', hideVideo);
router.put('/videos/:id/show', showVideo);
router.delete('/videos/:id', deleteVideo);

// Plan management
router.get('/plans', getAllPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

module.exports = router;