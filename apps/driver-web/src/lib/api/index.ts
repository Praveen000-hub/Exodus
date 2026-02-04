import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

const api = new ApiClient();

// Driver API
export const driverApi = {
  // Dashboard
  getDashboard: () => api.get('/driver/dashboard'),
  getProfile: () => api.get('/driver/profile'),
  
  // Assignment
  getAssignment: () => api.get('/driver/assignment'),
  updatePackageStatus: (packageId: number, status: string) =>
    api.post(`/driver/packages/${packageId}/status`, { status }),
  
  // Health
  getHealth: () => api.get('/driver/health'),
  submitHealthData: (data: any) => api.post('/driver/health', data),
  
  // Earnings
  getEarnings: () => api.get('/driver/earnings'),
  
  // Swaps
  getSwaps: () => api.get('/driver/swaps'),
  acceptSwap: (swapId: number) => api.post(`/driver/swaps/${swapId}/accept`),
  rejectSwap: (swapId: number) => api.post(`/driver/swaps/${swapId}/reject`),
  
  // Forecast
  getForecast: () => api.get('/driver/forecast'),
};

// Auth API
export const authApi = {
  login: (phone: string, password: string) =>
    api.post('/auth/login', { phone, password, role: 'driver' }),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export default api;
