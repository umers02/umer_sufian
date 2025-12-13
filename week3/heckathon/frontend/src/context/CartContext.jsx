import { createContext, useContext, useState, useEffect } from 'react'
import { cartApi } from '../services/cart.api'
import { useAuth } from './AuthContext'

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
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart()
      setCartItems(response.items || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  const addToCart = async (product) => {
    if (!user) return
    
    setLoading(true)
    try {
      await cartApi.addToCart(product.id, product.variantId, product.quantity)
      await fetchCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId) => {
    if (!user) return
    
    setLoading(true)
    try {
      await cartApi.removeFromCart(itemId)
      await fetchCart()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (!user) return
    
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }
    
    setLoading(true)
    try {
      await cartApi.updateCartItem(itemId, quantity)
      await fetchCart()
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity)
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

  const clearCart = async () => {
    if (!user) {
      setCartItems([])
      return
    }
    
    setLoading(true)
    try {
      await cartApi.clearCart()
      setCartItems([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
    } finally {
      setLoading(false)
    }
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
      clearCart,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}