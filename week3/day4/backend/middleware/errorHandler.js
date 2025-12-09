const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, 400, `${field} already exists`);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 400, 'Invalid ID format');
  }

  return errorResponse(res, 500, err.message || 'Server Error');
};

module.exports = errorHandler;
