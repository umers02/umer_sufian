const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new ErrorResponse('Access denied. No token provided', 401));
    }
    
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    if (user.isBlocked) {
      return next(new ErrorResponse('Account is blocked', 403));
    }
    
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Invalid token', 401));
  }
};

module.exports = { authenticate };