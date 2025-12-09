const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized, no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return errorResponse(res, 401, 'User not found');
    }

    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, token failed');
  }
};

module.exports = { protect };
