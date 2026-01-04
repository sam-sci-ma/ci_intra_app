"use client";


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simple mock authentication - in production, call your backend
      // For demo: admin1@scintranet.edu / admin2@scintranet.edu
      if (
        (email === 'admin1@scintranet.edu' && password === 'password') ||
        (email === 'admin2@scintranet.edu' && password === 'password')
      ) {
        const userData = {
          id: email.split('@')[0],
          email,
          name: email === 'admin1@scintranet.edu' ? 'Admin User 1' : 'Admin User 2'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
