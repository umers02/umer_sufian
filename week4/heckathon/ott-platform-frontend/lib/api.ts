import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Movie API functions
export const movieAPI = {
  // Add movie to database
  addMovie: async (movieData: any) => {
    const response = await api.post('/movies', movieData)
    return response.data
  },

  // Get all movies from database
  getAllMovies: async (params?: { page?: number; limit?: number; genre?: string; search?: string }) => {
    const response = await api.get('/movies', { params })
    return response.data
  },

  // Get single movie
  getMovie: async (tmdbId: number) => {
    const response = await api.get(`/movies/${tmdbId}`)
    return response.data
  },

  // Update movie
  updateMovie: async (tmdbId: number, updates: any) => {
    const response = await api.put(`/movies/${tmdbId}`, updates)
    return response.data
  },

  // Delete movie
  deleteMovie: async (tmdbId: number) => {
    const response = await api.delete(`/movies/${tmdbId}`)
    return response.data
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/movies/admin/dashboard-stats')
    return response.data
  }
}

export default api