const { ROLES } = require('../constants/roles');
const ErrorResponse = require('../utils/errorResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Access denied. Please authenticate first', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Access denied. Insufficient permissions', 403));
    }
    
    next();
  };
};

const isSuperAdmin = authorize(ROLES.SUPERADMIN);
const isAdmin = authorize(ROLES.ADMIN, ROLES.SUPERADMIN);
const isUser = authorize(ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN);

module.exports = { authorize, isSuperAdmin, isAdmin, isUser };