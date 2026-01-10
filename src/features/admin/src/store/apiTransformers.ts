/**
 * API Transformers for Admin Feature
 * Transforms backend API responses to frontend format
 */

import type { AdminUser, Role } from './states';

// Backend User response structure
export interface BackendUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  roles?: BackendRole[];
}

// Backend Role response structure
export interface BackendRole {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

/**
 * Transform backend user to frontend admin user
 */
export const transformUser = (backendUser: BackendUser): AdminUser => {
  return {
    id: backendUser.id,
    username: backendUser.username,
    email: backendUser.email,
    displayName: backendUser.displayName,
    isActive: backendUser.isActive,
    roles: backendUser.roles
      ? backendUser.roles.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          permissions: r.permissions,
        }))
      : [],
    createdAt: typeof backendUser.createdAt === 'string' ? backendUser.createdAt : backendUser.createdAt.toISOString(),
    updatedAt: typeof backendUser.updatedAt === 'string' ? backendUser.updatedAt : backendUser.updatedAt.toISOString(),
  };
};

/**
 * Transform array of backend users to frontend admin users
 */
export const transformUsers = (backendUsers: BackendUser[]): AdminUser[] => {
  return backendUsers.map(transformUser);
};





