'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User & { token?: string }, tokenStr: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const stripToken = (data: User & { token?: string }): User => {
  const { token: _token, ...user } = data;
  return user;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push('/login');
  }, [clearSession, router]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    api
      .get('/auth/me')
      .then((res) => {
        setUser(stripToken(res.data));
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearSession();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [clearSession]);

  const login = (userData: User & { token?: string }, tokenStr: string) => {
    setUser(stripToken(userData));
    setToken(tokenStr);
    localStorage.setItem('token', tokenStr);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
