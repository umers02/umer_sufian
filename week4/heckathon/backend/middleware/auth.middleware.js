const jwt = require('../utils/jwt');
const User = require('../models/User.model');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verifyToken(token);
    console.log('Auth middleware - Token decoded:', decoded.id);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('Auth middleware - User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (user.isBlocked) {
      console.log('Auth middleware - User is blocked:', user.email);
      return res.status(403).json({ message: 'Account has been blocked. Contact administrator.' });
    }

    console.log('Auth middleware - User authenticated:', user.email, 'Role:', user.role);
    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware - Token verification failed:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticate };