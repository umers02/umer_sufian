import { api } from './api'

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  signup: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  }
}