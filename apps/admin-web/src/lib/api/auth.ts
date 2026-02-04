import { api } from './client';
import type { LoginResponse, Admin } from '@/types';
import { MOCK_ADMIN, MOCK_CREDENTIALS } from '@/lib/mock-data';

// 🎭 DEMO MODE - Hardcoded authentication
const DEMO_MODE = true;

export const authApi = {
  /**
   * Admin login
   */
  login: async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    // DEMO MODE: Use mock authentication
    if (DEMO_MODE) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate credentials
      if (credentials.username === MOCK_CREDENTIALS.username && 
          credentials.password === MOCK_CREDENTIALS.password) {
        const mockResponse: LoginResponse = {
          access_token: 'mock-jwt-token-' + Date.now(),
          token_type: 'bearer',
          user: MOCK_ADMIN,
        };
        
        // Store token and user data
        localStorage.setItem('token', mockResponse.access_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        throw new Error('Invalid username or password');
      }
    }
    
    // PRODUCTION MODE: Use real API
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store token and user data
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  /**
   * Logout
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): Admin | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  /**
   * Refresh token (if implemented)
   */
  refreshToken: async (): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh');
  },
};
