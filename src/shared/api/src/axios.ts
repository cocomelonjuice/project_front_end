import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../../constants/src';

/**
 * Axios instance with interceptors
 * Similar to vaccine-rsa-web-v2 packages/shared/api
 */

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - only redirect if not already on login/register page
      // This prevents page reload when login fails with wrong credentials
      const currentPath = window.location.pathname;
      const isPublicRoute = currentPath === '/login' || currentPath === '/register';
      
      if (!isPublicRoute) {
        // Only redirect if we're not already on a public route
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        // On public routes, just clear tokens but don't redirect (prevents reload)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

