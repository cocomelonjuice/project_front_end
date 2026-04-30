/**
 * Projects Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { Project } from './states';

export const projectsApi = {
  // Get all projects
  getProjects: (params?: { scope?: 'managed' }) =>
    axiosInstance.get<Project[]>(API_ENDPOINTS.PROJECTS.GET_ALL, { params }),

  // Get project by ID
  getProjectById: (id: string) =>
    axiosInstance.get<Project>(API_ENDPOINTS.PROJECTS.GET_BY_ID(id)),

  // Create project
  createProject: (data: { name: string; type: string; description?: string }) =>
    axiosInstance.post<Project>(API_ENDPOINTS.PROJECTS.CREATE, data),

  // Update project
  updateProject: (id: string, data: { name?: string; type?: string; description?: string }) =>
    axiosInstance.put<Project>(API_ENDPOINTS.PROJECTS.UPDATE(id), data),

  // Delete project
  deleteProject: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.PROJECTS.DELETE(id)),
};

export default projectsApi;





