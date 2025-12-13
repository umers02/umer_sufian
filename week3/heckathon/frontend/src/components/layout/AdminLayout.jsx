import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'

export default function AdminLayout({ children }) {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    ...(user?.role === 'superadmin' ? [{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }] : []),
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ...(user?.role === 'superadmin' ? [{ name: 'Users', href: '/admin/users', icon: Users }] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <ArrowLeft className="h-5 w-5" />
              Back to Store
            </Link>
          </div>
          <nav className="px-4 pb-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}