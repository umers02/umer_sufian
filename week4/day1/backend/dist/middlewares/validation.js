"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateId = exports.validateLogin = exports.validateUser = exports.validateCreateTask = exports.validateTask = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateTask = [
    (0, express_validator_1.body)('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    handleValidationErrors
];
exports.validateCreateTask = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
    (0, express_validator_1.body)('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    (0, express_validator_1.body)('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
    handleValidationErrors
];
exports.validateUser = [
    (0, express_validator_1.body)('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];
exports.validateId = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid ID format'),
    handleValidationErrors
];
//# sourceMappingURL=validation.js.map