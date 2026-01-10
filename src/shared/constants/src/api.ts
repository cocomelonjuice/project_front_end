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
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Projects
  PROJECTS: {
    CREATE: '/projects',
    GET_ALL: '/projects',
    GET_BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    GET_TEAM_MEMBERS: (id: string) => `/projects/${id}/team-members`,
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
  // Comments
  COMMENTS: {
    CREATE: (issueId: string) => `/issues/${issueId}/comments`,
    GET_BY_ISSUE: (issueId: string) => `/issues/${issueId}/comments`,
    GET_BY_ID: (id: string) => `/comments/${id}`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
  },
  // Attachments
  ATTACHMENTS: {
    CREATE: (issueId: string) => `/issues/${issueId}/attachments`,
    GET_BY_ISSUE: (issueId: string) => `/issues/${issueId}/attachments`,
    GET_BY_ID: (id: string) => `/attachments/${id}`,
    DOWNLOAD: (id: string) => `/attachments/${id}/download`,
    DELETE: (id: string) => `/attachments/${id}`,
  },
  // Labels
  LABELS: {
    CREATE: '/labels',
    GET_ALL: '/labels',
    GET_BY_ID: (id: string) => `/labels/${id}`,
    UPDATE: (id: string) => `/labels/${id}`,
    DELETE: (id: string) => `/labels/${id}`,
    ADD_TO_ISSUE: (issueId: string, labelId: string) => `/labels/issues/${issueId}/labels/${labelId}`,
    REMOVE_FROM_ISSUE: (issueId: string, labelId: string) => `/labels/issues/${issueId}/labels/${labelId}`,
  },
  // Workflows
  WORKFLOWS: {
    CREATE: '/workflows',
    GET_ALL: '/workflows',
    GET_BY_ID: (id: string) => `/workflows/${id}`,
    UPDATE: (id: string) => `/workflows/${id}`,
    DELETE: (id: string) => `/workflows/${id}`,
    GET_TRANSITIONS: (id: string) => `/workflows/${id}/transitions`,
    ADD_TRANSITION: (id: string) => `/workflows/${id}/transitions`,
    DELETE_TRANSITION: (id: string, transitionId: string) => `/workflows/${id}/transitions/${transitionId}`,
  },
  // Roles
  ROLES: {
    CREATE: '/roles',
    GET_ALL: '/roles',
    GET_BY_ID: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    ASSIGN_TO_USER_IN_PROJECT: (projectId: string, roleId: string, userId: string) => `/roles/projects/${projectId}/roles/${roleId}/users/${userId}`,
    REMOVE_FROM_USER_IN_PROJECT: (projectId: string, roleId: string, userId: string) => `/roles/projects/${projectId}/roles/${roleId}/users/${userId}`,
  },
  // Add more endpoints as needed
} as const;

