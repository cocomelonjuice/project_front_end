/**
 * Reference Data Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { IssueType, Priority, Status } from './states';

export const referenceDataApi = {
  // Issue Types
  getIssueTypes: () =>
    axiosInstance.get<IssueType[]>(API_ENDPOINTS.ISSUE_TYPES.GET_ALL),

  getIssueTypeById: (id: string) =>
    axiosInstance.get<IssueType>(API_ENDPOINTS.ISSUE_TYPES.GET_BY_ID(id)),

  createIssueType: (data: { name: string; description?: string }) =>
    axiosInstance.post<IssueType>(API_ENDPOINTS.ISSUE_TYPES.CREATE, data),

  updateIssueType: (id: string, data: { name?: string; description?: string }) =>
    axiosInstance.put<IssueType>(API_ENDPOINTS.ISSUE_TYPES.UPDATE(id), data),

  deleteIssueType: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.ISSUE_TYPES.DELETE(id)),

  // Priorities
  getPriorities: () =>
    axiosInstance.get<Priority[]>(API_ENDPOINTS.PRIORITIES.GET_ALL),

  getPriorityById: (id: string) =>
    axiosInstance.get<Priority>(API_ENDPOINTS.PRIORITIES.GET_BY_ID(id)),

  createPriority: (data: { name: string; orderNum: number }) =>
    axiosInstance.post<Priority>(API_ENDPOINTS.PRIORITIES.CREATE, data),

  updatePriority: (id: string, data: { name?: string; orderNum?: number }) =>
    axiosInstance.put<Priority>(API_ENDPOINTS.PRIORITIES.UPDATE(id), data),

  deletePriority: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.PRIORITIES.DELETE(id)),

  // Statuses
  getStatuses: () =>
    axiosInstance.get<Status[]>(API_ENDPOINTS.STATUSES.GET_ALL),

  getStatusById: (id: string) =>
    axiosInstance.get<Status>(API_ENDPOINTS.STATUSES.GET_BY_ID(id)),

  createStatus: (data: { name: string; category: string; color?: string }) =>
    axiosInstance.post<Status>(API_ENDPOINTS.STATUSES.CREATE, data),

  updateStatus: (id: string, data: { name?: string; category?: string; color?: string }) =>
    axiosInstance.put<Status>(API_ENDPOINTS.STATUSES.UPDATE(id), data),

  deleteStatus: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.STATUSES.DELETE(id)),
};

export default referenceDataApi;







