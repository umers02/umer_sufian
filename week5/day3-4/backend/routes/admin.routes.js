const express = require('express');
const {
  getDashboardStats,
  getUsers,
  blockUser,
  unblockUser,
  createAdmin,
  deleteAdmin,
  getInventoryReport,
  getOrders,
  updateOrderStatus,
  getOrderDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails
} = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isSuperAdmin, isAdmin } = require('../middleware/role.middleware');

const router = express.Router();

// Admin routes (accessible by admin and superadmin)
router.get('/dashboard', authenticate, isAdmin, getDashboardStats);
router.get('/inventory', authenticate, isAdmin, getInventoryReport);
router.get('/orders', authenticate, isAdmin, getOrders);
router.get('/orders/:orderId', authenticate, isAdmin, getOrderDetails);
router.put('/orders/:orderId/status', authenticate, isAdmin, updateOrderStatus);
router.post('/products', authenticate, isAdmin, createProduct);
router.get('/products/:productId', authenticate, isAdmin, getProductDetails);
router.put('/products/:productId', authenticate, isAdmin, updateProduct);
router.delete('/products/:productId', authenticate, isAdmin, deleteProduct);

// Superadmin only routes
router.get('/users', authenticate, isSuperAdmin, getUsers);
router.put('/users/:userId/block', authenticate, isSuperAdmin, blockUser);
router.put('/users/:userId/unblock', authenticate, isSuperAdmin, unblockUser);
router.post('/admins', authenticate, isSuperAdmin, createAdmin);
router.delete('/admins/:adminId', authenticate, isSuperAdmin, deleteAdmin);

module.exports = router;