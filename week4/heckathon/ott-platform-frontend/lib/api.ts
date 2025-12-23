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
  // Add TMDB movie to database (Admin only)
  addMovie: async (movieData: any) => {
    const response = await api.post('/admin/movies/tmdb', movieData)
    return response.data
  },

  // Get all movies from database (Public - combined TMDB + Manual)
  getAllMovies: async (params?: { page?: number; limit?: number; genre?: string; search?: string }) => {
    const response = await api.get('/user/movies', { params })
    return response.data
  },

  // Get all movies for admin (Admin only)
  getAllMoviesAdmin: async (params?: { page?: number; limit?: number; genre?: string; search?: string }) => {
    const response = await api.get('/admin/movies', { params })
    return response.data
  },

  // Get single movie (Public)
  getMovie: async (id: number | string) => {
    const response = await api.get(`/user/movies/${id}`)
    return response.data
  },

  // Update TMDB movie (Admin only)
  updateMovie: async (tmdbId: number, updates: any) => {
    const response = await api.put(`/admin/movies/tmdb/${tmdbId}`, updates)
    return response.data
  },

  // Delete TMDB movie (Admin only)
  deleteMovie: async (tmdbId: number) => {
    const response = await api.delete(`/admin/movies/tmdb/${tmdbId}`)
    return response.data
  },

  // Delete Manual movie (Admin only)
  deleteManualMovie: async (movieId: string) => {
    const response = await api.delete(`/admin/movies/manual/${movieId}`)
    return response.data
  },

  // Get dashboard stats (Admin only)
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  // Get movies by genre for home page categories
  getMoviesByGenre: async () => {
    const response = await api.get('/user/movies/genres/categories')
    return response.data
  }
}

export default api