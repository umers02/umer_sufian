const { body } = require('express-validator');

const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('category')
    .isMongoId()
    .withMessage('Valid category ID is required'),
  body('flavor')
    .trim()
    .notEmpty()
    .withMessage('Flavor is required')
];

const validateVariant = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Variant name must be between 2 and 50 characters'),
  body('size')
    .trim()
    .notEmpty()
    .withMessage('Size is required'),
  body('weight')
    .trim()
    .notEmpty()
    .withMessage('Weight is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters')
];

module.exports = {
  validateProduct,
  validateVariant
};