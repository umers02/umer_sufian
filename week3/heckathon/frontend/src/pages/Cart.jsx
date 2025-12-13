import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Trash2, Plus, Minus } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/collection')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    // Handle variant - can be string or object
                    let variantDisplay = 'Standard'
                    if (item.variant) {
                      if (typeof item.variant === 'object' && item.variant !== null) {
                        variantDisplay = item.variant.name || item.variant.size || 'Standard'
                      } else if (typeof item.variant === 'string') {
                        variantDisplay = item.variant
                      }
                    }
                    
                    // Get product name - handle both string and object cases
                    let productName = 'Product'
                    if (item.name) {
                      productName = typeof item.name === 'string' ? item.name : (item.name.name || 'Product')
                    } else if (item.product) {
                      if (typeof item.product === 'object' && item.product !== null) {
                        productName = item.product.name || 'Product'
                      } else if (typeof item.product === 'string') {
                        productName = item.product
                      }
                    }
                    
                    // Get item image
                    let itemImage = '/placeholder-tea.jpg'
                    if (item.image) {
                      itemImage = typeof item.image === 'string' ? item.image : (item.image[0] || '/placeholder-tea.jpg')
                    } else if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                      itemImage = item.product.images[0]
                    }
                    
                    // Get item ID for operations
                    const itemId = item._id || item.id
                    const variantId = typeof item.variant === 'object' && item.variant?._id 
                      ? item.variant._id 
                      : (item.variantId || (typeof item.variant === 'string' ? item.variant : String(itemId)))
                    
                    return (
                      <div key={`${itemId}-${String(variantId)}`} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img 
                          src={itemImage} 
                          alt={productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{productName}</h3>
                          <p className="text-sm text-gray-600">{variantDisplay}</p>
                          <p className="font-medium">{formatPrice(item.price || 0)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon-sm"
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon-sm"
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon-sm"
                          onClick={() => removeFromCart(itemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>€5.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>€{(getCartTotal() + 5).toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}