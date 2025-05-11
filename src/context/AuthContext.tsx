import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { AdminUser, AuthContextType, LoginCredentials } from '../types';
import { API_URL } from '../config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('instapark_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/admin`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token } = response.data;
      
      localStorage.setItem('instapark_token', token);
      setToken(token);
      await fetchCurrentUser(token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('instapark_token');
    setToken(null);
    setUser(null);
  };

  // Check authentication on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('instapark_token');
      
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        await fetchCurrentUser(storedToken);
      } else if (storedToken) {
        // Token exists but is expired
        logout();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};