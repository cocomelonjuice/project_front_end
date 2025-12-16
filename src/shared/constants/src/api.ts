/**
 * API Endpoints
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
  // Issues
  ISSUES: {
    CREATE: (projectId: string) => `/projects/${projectId}/issues`,
    GET_ALL: (projectId: string) => `/projects/${projectId}/issues`,
    GET_BY_ID: (id: string) => `/issues/${id}`,
    UPDATE: (id: string) => `/issues/${id}`,
    DELETE: (id: string) => `/issues/${id}`,
    ASSIGN: (id: string) => `/issues/${id}/assign`,
    TRANSITION: (id: string) => `/issues/${id}/transition`,
  },
  // Add more endpoints as needed
} as const;

