const { body, param, validationResult } = require('express-validator');

const validateVote = [
  param('id').isMongoId().withMessage('Invalid proposal ID'),
  body('vote').isIn(['yes', 'no', 'abstain']).withMessage('Vote must be yes, no, or abstain'),
  body('walletAddress').optional().isEthereumAddress().withMessage('Invalid wallet address'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateProposalId = [
  param('id').isMongoId().withMessage('Invalid proposal ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid proposal ID'
      });
    }
    next();
  }
];

module.exports = { validateVote, validateProposalId };