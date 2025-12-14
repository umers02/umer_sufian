import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Button } from './button'

export default function CartPopup() {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useCart()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const subtotal = getCartTotal()
  const delivery = 3.95
  const total = subtotal + delivery

  return (
    <>
      {/* Cart Popup */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 md:w-80 lg:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold" style={{fontFamily: 'Montserrat, sans-serif'}}>
              My Bag
            </h2>
            <button 
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
              Your bag is empty
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
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
                  itemImage = typeof item.image === 'string' ? item.image : (Array.isArray(item.image) ? item.image[0] : '/placeholder-tea.jpg')
                } else if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                  itemImage = item.product.images[0]
                }
                
                const itemId = item._id || item.id
                
                return (
                  <div key={`${itemId}-${variantDisplay}`} className="flex items-start gap-2 sm:gap-3">
                    <img 
                      src={itemImage} 
                      alt={productName}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-xs sm:text-sm break-words" style={{fontFamily: 'Montserrat, sans-serif'}}>
                        {productName} - {variantDisplay}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(itemId)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline mt-1"
                        style={{fontFamily: 'Montserrat, sans-serif'}}
                      >
                        REMOVE
                      </button>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <div className="flex items-center border flex-shrink-0">
                          <button 
                            onClick={() => updateQuantity(itemId, item.quantity - 1)}
                            className="px-1 sm:px-2 py-1 hover:bg-gray-50 text-sm"
                          >
                            −
                          </button>
                          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(itemId, item.quantity + 1)}
                            className="px-1 sm:px-2 py-1 hover:bg-gray-50 text-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-medium text-xs sm:text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                          €{(item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm" style={{fontFamily: 'Montserrat, sans-serif'}}>
                <span>Delivery</span>
                <span>€{delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm sm:text-base" style={{fontFamily: 'Montserrat, sans-serif'}}>
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white py-2 sm:py-3 rounded-none text-sm sm:text-base"
              onClick={() => {
                closeCart()
                navigate('/checkout')
              }}
            >
              PURCHASE
            </Button>
          </div>
        )}
      </div>
    </>
  )
}