/**
 * API Transformers for Roles/Team
 * Transforms backend API responses to frontend format
 */

import type { Role, ProjectTeamMember } from './states';
import type { User } from '../../users/src/store/states';

// Backend Role response structure
export interface BackendRole {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  users?: BackendUser[];
  projects?: Array<{ id: string }>;
}

// Backend User response structure (for roles relationship)
export interface BackendUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  roles?: BackendRole[];
}

/**
 * Transform backend role to frontend role
 */
export const transformRole = (backendRole: BackendRole): Role => {
  return {
    id: backendRole.id,
    name: backendRole.name,
    description: backendRole.description,
    permissions: backendRole.permissions,
  };
};

/**
 * Transform array of backend roles to frontend roles
 */
export const transformRoles = (backendRoles: BackendRole[]): Role[] => {
  return backendRoles.map(transformRole);
};

/**
 * Transform backend user to frontend user (for team members)
 */
export const transformUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id,
    username: backendUser.username,
    email: backendUser.email,
    displayName: backendUser.displayName,
    isActive: backendUser.isActive,
  };
};

// Backend Team Member response structure
export interface BackendTeamMember {
  user: BackendUser;
  role: BackendRole;
}

/**
 * Transform backend team member to frontend team member
 */
export const transformTeamMember = (backendMember: BackendTeamMember): ProjectTeamMember => {
  return {
    userId: backendMember.user.id,
    user: transformUser(backendMember.user),
    roleId: backendMember.role.id,
    role: transformRole(backendMember.role),
  };
};

/**
 * Transform array of backend team members to frontend team members
 */
export const transformTeamMembers = (backendMembers: BackendTeamMember[]): ProjectTeamMember[] => {
  return backendMembers.map(transformTeamMember);
};

