export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  VIDEOS: {
    LIST: '/videos',
    DETAIL: '/videos/:id',
    SEARCH: '/videos/search',
    CATEGORY: '/videos/category/:category'
  },
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    SUBSCRIBE: '/subscriptions/subscribe',
    STATUS: '/subscriptions/status',
    CANCEL: '/subscriptions/cancel'
  }
}

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  MOVIES: '/movies',
  PROFILE: '/profile',
  SUBSCRIPTION: '/subscription',
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    VIDEOS: '/admin/videos'
  }
}

export const VIDEO_CATEGORIES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Documentary'
]