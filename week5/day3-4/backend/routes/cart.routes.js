const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isUser } = require('../middleware/role.middleware');
const { validateAddToCart, validateUpdateCartItem } = require('../validators/cart.validator');
const { handleValidationErrors } = require('../validators/auth.validator');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);
router.use(isUser);

router.get('/', getCart);
router.post('/add', validateAddToCart, handleValidationErrors, addToCart);
router.put('/item/:itemId', validateUpdateCartItem, handleValidationErrors, updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;