export const auth = {
  // Login function
  login: (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Get current user
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Check user role
  hasRole: (role: string) => {
    const user = auth.getUser()
    return user?.role?.toLowerCase() === role.toLowerCase()
  },

  // Get role-based redirect URL
  getRoleBasedRedirect: () => {
    const user = auth.getUser()
    if (!user) return '/login'
    
    const role = user.role?.toLowerCase()
    switch (role) {
      case 'admin':
        return '/admin'
      case 'superadmin':
        return '/superadmin'
      default:
        return '/home'
    }
  }
}