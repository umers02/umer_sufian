const { body } = require('express-validator');

const validateAddToCart = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('variantId')
    .isMongoId()
    .withMessage('Valid variant ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

const validateUpdateCartItem = [
  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

module.exports = {
  validateAddToCart,
  validateUpdateCartItem
};