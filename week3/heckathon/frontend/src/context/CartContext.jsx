import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.variant === product.variant
      )
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.variant === product.variant
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      }
      
      return [...prev, product]
    })
  }

  const removeFromCart = (productId, variant) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && item.variant === variant)
    ))
  }

  const updateQuantity = (productId, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant)
      return
    }
    
    setCartItems(prev => prev.map(item =>
      item.id === productId && item.variant === variant
        ? { ...item, quantity }
        : item
    ))
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('€', ''))
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemsCount,
      isCartOpen,
      toggleCart,
      closeCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}