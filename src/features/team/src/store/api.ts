/**
 * Roles/Team Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformRole, transformRoles, transformTeamMembers, type BackendRole, type BackendTeamMember } from './apiTransformers';
import type { Role, CreateRoleData, UpdateRoleData, AssignRoleData, ProjectTeamMember } from './states';

export const rolesApi = {
  // Create role
  createRole: (data: CreateRoleData) =>
    axiosInstance.post<BackendRole>(API_ENDPOINTS.ROLES.CREATE, data).then((response) => ({
      ...response,
      data: transformRole(response.data),
    })),

  // Get all roles
  getRoles: () =>
    axiosInstance.get<BackendRole[]>(API_ENDPOINTS.ROLES.GET_ALL).then((response) => ({
      ...response,
      data: transformRoles(response.data || []),
    })),

  // Get role by ID
  getRoleById: (id: string) =>
    axiosInstance.get<BackendRole>(API_ENDPOINTS.ROLES.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformRole(response.data),
    })),

  // Update role
  updateRole: (id: string, data: UpdateRoleData) =>
    axiosInstance.put<BackendRole>(API_ENDPOINTS.ROLES.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformRole(response.data),
    })),

  // Delete role
  deleteRole: (id: string) => axiosInstance.delete<void>(API_ENDPOINTS.ROLES.DELETE(id)),

  // Assign role to user in project
  assignRoleToUserInProject: (data: AssignRoleData) =>
    axiosInstance.post(
      API_ENDPOINTS.ROLES.ASSIGN_TO_USER_IN_PROJECT(data.projectId, data.roleId, data.userId)
    ),

  // Remove role from user in project
  removeRoleFromUserInProject: (data: AssignRoleData) =>
    axiosInstance.delete(
      API_ENDPOINTS.ROLES.REMOVE_FROM_USER_IN_PROJECT(data.projectId, data.roleId, data.userId)
    ),

  // Get team members for a project
  getTeamMembers: (projectId: string) =>
    axiosInstance.get<BackendTeamMember[]>(API_ENDPOINTS.PROJECTS.GET_TEAM_MEMBERS(projectId)).then((response) => ({
      ...response,
      data: transformTeamMembers(response.data || []),
    })),
};

export default rolesApi;

