import { api } from './api'

export const cartApi = {
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },
  
  addToCart: async (productId, variantId, quantity) => {
    const response = await api.post('/cart/add', {
      productId,
      variantId,
      quantity
    })
    return response.data
  },
  
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/update/${itemId}`, { quantity })
    return response.data
  },
  
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`)
    return response.data
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart/clear')
    return response.data
  }
}