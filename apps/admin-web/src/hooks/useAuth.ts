'use client';

import { create } from 'zustand';
import type { Admin } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    const user = authApi.getCurrentUser();
    const isAuthenticated = authApi.isAuthenticated();
    set({ user, isAuthenticated });
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ username, password });
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Login failed', 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null }),
}));

/**
 * Custom hook for authentication
 */
export function useAuth() {
  const store = useAuthStore();
  
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    initialize: store.initialize,
    clearError: store.clearError,
  };
}
