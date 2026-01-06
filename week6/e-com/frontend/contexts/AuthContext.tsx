'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

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
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = authService.getToken();
  //   const savedUser = authService.getUser();
    
  //   console.log('AuthContext - Token:', token);
  //   console.log('AuthContext - Saved user:', savedUser);
    
  //   if (token && savedUser) {
  //     setUser(savedUser);
  //     setIsAuthenticated(true);
  //   } else {
  //     setUser(null);
  //     setIsAuthenticated(false);
  //   }
  //   setLoading(false);
  // }, []);

  useEffect(() => {
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
  }, []);
  

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    
    // Handle wrapped response from backend
    const authData = response.data || response;
    
    console.log('Login response:', response);
    console.log('Auth data:', authData);
    
    authService.setAuth(authData.access_token, authData.user);
    setUser(authData.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/auth/login';
  };
  

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
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