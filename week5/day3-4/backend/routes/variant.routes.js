const express = require('express');
const {
  getVariantsByProduct,
  getVariant,
  createVariant,
  updateVariant,
  deleteVariant,
  checkStock
} = require('../controllers/variant.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const { validateVariant } = require('../validators/product.validator');
const { handleValidationErrors } = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.get('/product/:productId', getVariantsByProduct);
router.get('/:id', getVariant);
router.get('/:id/stock', checkStock);

// Admin routes
router.post('/product/:productId', authenticate, isAdmin, validateVariant, handleValidationErrors, createVariant);
router.put('/:id', authenticate, isAdmin, validateVariant, handleValidationErrors, updateVariant);
router.delete('/:id', authenticate, isAdmin, deleteVariant);

module.exports = router;