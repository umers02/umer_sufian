import axios from 'axios'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
})

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  runtime?: number
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { iso_639_1: string; name: string }[]
  status: string
  tagline: string
  budget: number
  revenue: number
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string
  order: number
}

export interface Review {
  id: string
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string
    rating: number
  }
  content: string
  created_at: string
  updated_at: string
}

// Search movies
export const searchMovies = async (query: string, page = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page }
  })
  return response.data
}

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page }
  })
  return response.data
}

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await tmdbApi.get(`/movie/${movieId}`)
  return response.data
}

// Get movie cast
export const getMovieCast = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}/credits`)
  return response.data
}

// Get movie reviews
export const getMovieReviews = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}/reviews`)
  return response.data
}

// Get movie videos/trailers
export const getMovieVideos = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}/videos`)
  return response.data
}

// Get similar movies
export const getSimilarMovies = async (movieId: number) => {
  const response = await tmdbApi.get(`/movie/${movieId}/similar`)
  return response.data
}

// Get genres
export const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list')
  return response.data
}

// Helper functions for image URLs
export const getImageUrl = (path: string, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}