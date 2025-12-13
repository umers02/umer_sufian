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
      // Backend returns { success: true, cart: { items: [...] } }
      setCartItems(response.cart?.items || response.items || [])
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      setCartItems([])
    }
  }

  const addToCart = async (product) => {
    if (!user) return
    
    setLoading(true)
    try {
      await cartApi.addToCart(product.id, product.variantId, product.quantity)
      await fetchCart()
    } catch (error) {
      console.error('Failed to add to cart, using local storage:', error)
      // Fallback to local cart management
      const existingItem = cartItems.find(item => 
        item.product?.id === product.id && item.variant === product.variant
      )
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = cartItems.map(item => 
          item.product?.id === product.id && item.variant === product.variant
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
        setCartItems(updatedItems)
      } else {
        // Add new item - store variantId so we can sync later
        const newItem = {
          _id: Date.now().toString(),
          id: product.id,
          name: product.name,
          image: product.image,
          product: {
            id: product.id,
            _id: product.id, // Store both for compatibility
            name: product.name,
            images: [product.image]
          },
          variant: product.variant,
          variantId: product.variantId, // Store variantId for syncing
          quantity: product.quantity,
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price.toString().replace('€', ''))
        }
        setCartItems(prev => [...prev, newItem])
      }
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
      console.error('Failed to remove from cart, using local storage:', error)
      // Fallback to local cart management
      setCartItems(prev => prev.filter(item => (item._id || item.id) !== itemId))
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
      console.error('Failed to update quantity, using local storage:', error)
      // Fallback to local cart management
      setCartItems(prev => prev.map(item => 
        (item._id || item.id) === itemId 
          ? { ...item, quantity }
          : item
      ))
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