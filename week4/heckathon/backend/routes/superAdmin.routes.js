const express = require('express');
const { getAllUsers, getAllAdmins, blockUser, unblockUser, createAdmin, blockAdmin, unblockAdmin, deleteAdmin, getDashboardStats } = require('../controllers/superAdmin/superAdmin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const router = express.Router();

router.use(authenticate);
router.use(authorize(['superAdmin']));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/admins', getAllAdmins);
router.put('/users/:userId/block', blockUser);
router.put('/users/:userId/unblock', unblockUser);
router.put('/admins/:adminId/block', blockAdmin);
router.put('/admins/:adminId/unblock', unblockAdmin);
router.delete('/admins/:adminId', deleteAdmin);
router.post('/admins', createAdmin);

module.exports = router;