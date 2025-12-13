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
  
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status })
    return response.data
  }
}