const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validateProduct } = require('../validators/product.validator');
const { handleValidationErrors } = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, isAdmin, validateProduct, handleValidationErrors, createProduct);
router.put('/:id', authenticate, isAdmin, validateProduct, handleValidationErrors, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);
router.post('/categories', authenticate, isAdmin, createCategory);

module.exports = router;