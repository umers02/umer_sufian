import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { orderApi } from '../services/order.api'
import { formatPrice } from '../utils/formatPrice'
import Loader from '../components/ui/Loader'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      // Use getOrders which fetches orders for the current user
      const response = await orderApi.getOrders()
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load order history. Please try again.')
      setOrders([])
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily: 'Montserrat, sans-serif'}}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No orders found</p>
              <Button onClick={() => window.location.href = '/collection'}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order {order.orderNumber || `#${order._id?.slice(-8) || 'N/A'}`}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.product?.images?.[0] || '/cineman-tea.jpg'} 
                              alt={item.product?.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.productName || item.product?.name || 'Product'}</p>
                              <p className="text-sm text-gray-600">
                                {item.variantName || item.variant?.name || item.variant?.size || 'Standard'} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Subtotal:</span>
                        <span>{formatPrice(order.totalAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Shipping:</span>
                        <span>€3.95</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{formatPrice((order.totalAmount || 0) + 3.95)}</span>
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}