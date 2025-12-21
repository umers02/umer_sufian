import api from './api'

export const videoService = {
  getVideos: async () => {
    const response = await api.get('/videos')
    return response.data
  },

  getVideoById: async (id: string) => {
    const response = await api.get(`/videos/${id}`)
    return response.data
  },

  searchVideos: async (query: string) => {
    const response = await api.get(`/videos/search?q=${query}`)
    return response.data
  },

  getVideosByCategory: async (category: string) => {
    const response = await api.get(`/videos/category/${category}`)
    return response.data
  }
}