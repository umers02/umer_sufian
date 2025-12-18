import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../api/authApi'

interface AuthState {
  user: User | null
  token: string | null
  isConnected: boolean
}

// Load from localStorage
const loadFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('governance-auth')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { user: null, token: null, isConnected: false }
      }
    }
  }
  return { user: null, token: null, isConnected: false }
}

const initialState: AuthState = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isConnected = true
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('governance-auth', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
          isConnected: true
        }))
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isConnected = false
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('governance-auth')
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer