'use client'

import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { useEffect } from 'react'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken && !isAuthenticated) {
      // Verify token and get user data
      authService.getProfile()
        .then((userData) => {
          login(userData, storedToken)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
    }
  }, [isAuthenticated, login])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      login(response.user, response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
    } catch (error) {
      logout() // Logout locally even if API call fails
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout
  }
}