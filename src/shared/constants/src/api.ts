/**
 * API Endpoints
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GET_USER: '/auth/user',
    GET_ROLE: '/auth/role',
    GET_PERMISSIONS: '/auth/permissions',
    GET_FUNCTIONS: '/auth/functions',
  },
  // Add more endpoints as needed
} as const;

