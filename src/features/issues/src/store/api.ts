/**
 * Issues Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformIssue, transformIssues } from './apiTransformers';
import type { Issue } from './states';

export interface GetIssuesParams {
  projectId: string;
  statusId?: string;
  assigneeId?: string;
  priorityId?: string;
}

export const issuesApi = {
  // Create issue
  createIssue: (projectId: string, data: any) =>
    axiosInstance.post(API_ENDPOINTS.ISSUES.CREATE(projectId), data).then((response) => ({
      ...response,
      data: transformIssue(response.data),
    })),

  // Get all issues for a project (with optional filters)
  getIssues: (params: GetIssuesParams) => {
    const { projectId, ...filters } = params;
    return axiosInstance.get(API_ENDPOINTS.ISSUES.GET_ALL(projectId), {
      params: filters,
    }).then((response) => ({
      ...response,
      data: transformIssues(response.data),
    }));
  },

  // Get issue by ID
  getIssueById: (id: string) =>
    axiosInstance.get(API_ENDPOINTS.ISSUES.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformIssue(response.data),
    })),

  // Update issue
  updateIssue: (id: string, data: any) =>
    axiosInstance.put(API_ENDPOINTS.ISSUES.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformIssue(response.data),
    })),

  // Delete issue
  deleteIssue: (id: string) =>
    axiosInstance.delete(API_ENDPOINTS.ISSUES.DELETE(id)),

  // Assign issue to user
  assignIssue: (id: string, data: { assigneeId?: string | null }) =>
    axiosInstance.post(API_ENDPOINTS.ISSUES.ASSIGN(id), data).then((response) => ({
      ...response,
      data: transformIssue(response.data),
    })),

  // Transition issue status
  transitionIssue: (id: string, data: { statusId: string }) =>
    axiosInstance.post(API_ENDPOINTS.ISSUES.TRANSITION(id), data).then((response) => ({
      ...response,
      data: transformIssue(response.data),
    })),
};

export default issuesApi;
