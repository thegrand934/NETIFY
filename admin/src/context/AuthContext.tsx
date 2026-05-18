'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (userData: AdminUser & { token?: string }, tokenStr: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const stripToken = (data: AdminUser & { token?: string }): AdminUser => {
  const { token: _token, ...user } = data;
  return user;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push('/login');
  }, [clearSession, router]);

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data.role !== 'admin') {
          clearSession();
        } else {
          setUser(stripToken(res.data));
        }
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

  useEffect(() => {
    if (isLoading) return;
    if (user && pathname === '/login') {
      router.replace('/');
    } else if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  const login = (userData: AdminUser & { token?: string }, tokenStr: string): boolean => {
    const profile = stripToken(userData);
    if (profile.role !== 'admin') {
      return false;
    }
    setUser(profile);
    setToken(tokenStr);
    localStorage.setItem('adminToken', tokenStr);
    router.push('/');
    return true;
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
