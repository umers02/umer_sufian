import { api } from './api'

export const adminApi = {
  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },
  
  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
  
  blockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/block`)
    return response.data
  },
  
  unblockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unblock`)
    return response.data
  },
  
  // Order Management
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params })
    return response.data
  },
  
  getOrderDetails: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`)
    return response.data
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status })
    return response.data
  },
  
  // Product Management
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData)
    return response.data
  },
  
  getProductDetails: async (productId) => {
    const response = await api.get(`/admin/products/${productId}`)
    return response.data
  },
  
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/admin/products/${productId}`, productData)
    return response.data
  },
  
  deleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`)
    return response.data
  }
}