import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../ui/Loader'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  // Check role-based access
  if (requiredRole) {
    const userRole = user.role || 'user'
    
    // Superadmin can access everything
    if (userRole === 'superadmin') {
      return children
    }
    
    // Admin can access admin routes but not superadmin routes
    if (requiredRole === 'superadmin' && userRole !== 'superadmin') {
      return <Navigate to="/" />
    }
    
    // Check if user has required role
    if (requiredRole === 'admin' && !['admin', 'superadmin'].includes(userRole)) {
      return <Navigate to="/" />
    }
  }
  
  return children
}