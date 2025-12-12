const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isUser, isAdmin } = require('../middleware/role.middleware');

const router = express.Router();

// User routes
router.post('/', authenticate, isUser, createOrder);
router.get('/', authenticate, isUser, getOrders);
router.get('/:id', authenticate, isUser, getOrder);

// Admin routes
router.get('/admin/all', authenticate, isAdmin, getAllOrders);
router.put('/admin/:id/status', authenticate, isAdmin, updateOrderStatus);

module.exports = router;