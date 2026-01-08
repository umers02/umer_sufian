'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  loyaltyPoints: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth on mount and create a refresh function
  const refreshAuth = () => {
    const token = authService.getToken();
    const savedUser = authService.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);
  

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    const response = await authService.login({ email, password });
    const authData = response.data || response;
    
    // Set auth data in localStorage
    authService.setAuth(authData.access_token, authData.user);
    
    // Immediately update state
    setUser(authData.user);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    // Clear localStorage
    authService.logout();
    
    // Immediately clear state
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const token = authService.getToken();
      if (!token) return;
      
      const freshUserData = await userService.getCurrentUser();
      const userData = freshUserData.data || freshUserData;
      
      // Update both localStorage and state
      authService.setAuth(token, userData);
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      refreshUser,
      isAuthenticated,
      loading
    }} key={user?.id || 'no-user'}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}