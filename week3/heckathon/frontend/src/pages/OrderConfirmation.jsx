import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CheckCircle, Package, Truck } from 'lucide-react'

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart after successful order
    clearCart()
  }, [clearCart])

  const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-bold text-lg">{orderNumber}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold">Processing</p>
                  <p className="text-sm text-gray-600">1-2 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Truck className="h-8 w-8 text-green-500" />
                <div className="text-left">
                  <p className="font-semibold">Delivery</p>
                  <p className="text-sm text-gray-600">3-5 business days</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => navigate('/order-history')}
              >
                View Order History
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/collection')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}