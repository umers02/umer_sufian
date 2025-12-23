const authorize = (roles) => {
  return (req, res, next) => {
    console.log('Role middleware - Required roles:', roles);
    console.log('Role middleware - User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Role middleware - No user in request');
      return res.status(401).json({ message: 'Access denied. User not authenticated.' });
    }

    const userRole = req.user.role;
    
    // Handle role matching with proper case sensitivity
    const isAuthorized = roles.some(role => {
      if (role.toLowerCase() === 'superadmin' && userRole === 'superAdmin') {
        return true;
      }
      return role.toLowerCase() === userRole.toLowerCase();
    });
    
    console.log('Role middleware - Authorization result:', isAuthorized);
    
    if (!isAuthorized) {
      console.log('Role middleware - Access denied for role:', userRole);
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    console.log('Role middleware - Access granted');
    next();
  };
};

module.exports = { authorize };