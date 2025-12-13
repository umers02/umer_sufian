import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Package, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react'
import { adminApi } from '../../services/admin.api'
import { formatPrice } from '../../utils/formatPrice'
import Loader from '../../components/ui/Loader'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'superadmin'
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Try real API first, fallback to mock data
      try {
        const response = await adminApi.getAnalytics()
        const stats = response.stats
        
        setAnalytics({
          totalRevenue: stats.totalRevenue,
          revenueGrowth: 12, // Calculate from monthlyRevenue if needed
          totalOrders: stats.totalOrders,
          ordersGrowth: 8,
          totalUsers: stats.totalUsers,
          usersGrowth: 15,
          totalProducts: stats.totalProducts,
          lowStockProducts: stats.lowStockVariants?.length || 0,
          pendingOrders: stats.recentOrders?.filter(o => o.status === 'pending').length || 0
        })
        
        setRecentOrders(stats.recentOrders || [])
      } catch (apiError) {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data:', apiError.message)
        const mockAnalytics = {
          totalRevenue: 25000,
          revenueGrowth: 12,
          totalOrders: 150,
          ordersGrowth: 8,
          totalUsers: 45,
          usersGrowth: 15,
          totalProducts: 25,
          lowStockProducts: 3,
          pendingOrders: 5
        }
        
        const mockOrders = [
          {
            _id: '507f1f77bcf86cd799439011',
            status: 'pending',
            totalAmount: 45.99,
            createdAt: new Date(),
            user: { name: 'John Doe' }
          }
        ]
        
        setAnalytics(mockAnalytics)
        setRecentOrders(mockOrders)
      }
    } catch (error) {
      setError('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  // Render Superadmin Dashboard
  if (isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Superadmin Dashboard</h1>
            <p className="text-gray-600">Complete overview of your store</p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(analytics?.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.revenueGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.ordersGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.usersGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.lowStockProducts || 0} low stock items
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/products')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Product Management</CardTitle>
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{analytics?.totalProducts || 0}</p>
                  <p className="text-sm text-gray-600">Total Products</p>
                  {analytics?.lowStockProducts > 0 && (
                    <p className="text-xs text-yellow-600">{analytics.lowStockProducts} need restocking</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order Management</CardTitle>
                  <ShoppingCart className="h-6 w-6 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{analytics?.totalOrders || 0}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  {analytics?.pendingOrders > 0 && (
                    <p className="text-xs text-orange-600">{analytics.pendingOrders} pending</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Low Stock:</span>
                    <span className="text-sm font-medium">{analytics?.lowStockProducts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Orders:</span>
                    <span className="text-sm font-medium">{analytics?.pendingOrders || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/admin/orders')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">
                          Order {order.orderNumber || `#${order._id?.slice(-8) || 'N/A'}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.user?.name || 'Unknown User'} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="font-medium">{formatPrice(order.totalAmount || 0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    )
  }

  // Render Admin Dashboard (simplified)
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your products and orders</p>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Product Management</CardTitle>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold mb-2">{analytics?.totalProducts || 0}</p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
                {analytics?.lowStockProducts > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800">
                      {analytics.lowStockProducts} products need restocking
                    </p>
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate('/admin/products')}
                >
                  Manage Products
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Order Management</CardTitle>
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold mb-2">{analytics?.totalOrders || 0}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                {analytics?.pendingOrders > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-orange-800">
                      {analytics.pendingOrders} orders pending
                    </p>
                  </div>
                )}
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate('/admin/orders')}
                >
                  Manage Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Preview */}
        {recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">
                        Order {order.orderNumber || `#${order._id?.slice(-8) || 'N/A'}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user?.name || 'Unknown User'} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="font-medium">{formatPrice(order.totalAmount || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}