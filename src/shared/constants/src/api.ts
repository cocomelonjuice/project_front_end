/**
 * API Endpoints
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GET_USER: '/auth/me',
    GET_ROLE: '/auth/role',
    GET_PERMISSIONS: '/auth/permissions',
    GET_FUNCTIONS: '/auth/functions',
  },
  // Users
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
  },
  // Projects
  PROJECTS: {
    CREATE: '/projects',
    GET_ALL: '/projects',
    GET_BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  // Boards
  BOARDS: {
    CREATE: (projectId: string) => `/projects/${projectId}/boards`,
    GET_BY_PROJECT: (projectId: string) => `/projects/${projectId}/boards`,
    GET_BY_ID: (id: string) => `/boards/${id}`,
    UPDATE: (id: string) => `/boards/${id}`,
    DELETE: (id: string) => `/boards/${id}`,
  },
  // Sprints
  SPRINTS: {
    CREATE: (boardId: string) => `/boards/${boardId}/sprints`,
    GET_BY_BOARD: (boardId: string) => `/boards/${boardId}/sprints`,
    GET_BY_ID: (id: string) => `/sprints/${id}`,
    UPDATE: (id: string) => `/sprints/${id}`,
    DELETE: (id: string) => `/sprints/${id}`,
    START: (id: string) => `/sprints/${id}/start`,
    COMPLETE: (id: string) => `/sprints/${id}/complete`,
    GET_ISSUES: (sprintId: string) => `/sprints/${sprintId}/issues`,
  },
  // Reference Data
  ISSUE_TYPES: {
    GET_ALL: '/issue-types',
    GET_BY_ID: (id: string) => `/issue-types/${id}`,
    CREATE: '/issue-types',
    UPDATE: (id: string) => `/issue-types/${id}`,
    DELETE: (id: string) => `/issue-types/${id}`,
  },
  PRIORITIES: {
    GET_ALL: '/priorities',
    GET_BY_ID: (id: string) => `/priorities/${id}`,
    CREATE: '/priorities',
    UPDATE: (id: string) => `/priorities/${id}`,
    DELETE: (id: string) => `/priorities/${id}`,
  },
  STATUSES: {
    GET_ALL: '/statuses',
    GET_BY_ID: (id: string) => `/statuses/${id}`,
    CREATE: '/statuses',
    UPDATE: (id: string) => `/statuses/${id}`,
    DELETE: (id: string) => `/statuses/${id}`,
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

