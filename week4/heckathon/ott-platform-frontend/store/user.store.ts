import { create } from 'zustand'

interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  autoplay: boolean
}

interface UserState {
  preferences: UserPreferences
  watchHistory: string[]
  favorites: string[]
  setPreferences: (preferences: Partial<UserPreferences>) => void
  addToWatchHistory: (videoId: string) => void
  addToFavorites: (videoId: string) => void
  removeFromFavorites: (videoId: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  preferences: {
    theme: 'dark',
    language: 'en',
    autoplay: true
  },
  watchHistory: [],
  favorites: [],
  setPreferences: (preferences) => set((state) => ({
    preferences: { ...state.preferences, ...preferences }
  })),
  addToWatchHistory: (videoId) => set((state) => ({
    watchHistory: [videoId, ...state.watchHistory.filter(id => id !== videoId)]
  })),
  addToFavorites: (videoId) => set((state) => ({
    favorites: [...state.favorites, videoId]
  })),
  removeFromFavorites: (videoId) => set((state) => ({
    favorites: state.favorites.filter(id => id !== videoId)
  }))
}))