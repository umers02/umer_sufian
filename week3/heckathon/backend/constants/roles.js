const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  USER: 'user'
};

const PERMISSIONS = {
  [ROLES.SUPERADMIN]: ['*'],
  [ROLES.ADMIN]: ['products:*', 'orders:*', 'variants:*'],
  [ROLES.USER]: ['cart:*', 'orders:read', 'products:read']
};

module.exports = { ROLES, PERMISSIONS };