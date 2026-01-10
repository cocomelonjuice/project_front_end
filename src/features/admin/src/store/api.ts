/**
 * Admin Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformUser, transformUsers, type BackendUser } from './apiTransformers';
import type { AdminUser, UpdateUserData } from './states';
import referenceDataApi from '../../../reference-data/src/store/api';
import labelsApi from '../../../labels/src/store/api';

export const adminApi = {
  // Get all users
  getUsers: () =>
    axiosInstance.get<BackendUser[]>(API_ENDPOINTS.USERS.GET_ALL).then((response) => ({
      ...response,
      data: transformUsers(response.data || []),
    })),

  // Get user by ID
  getUserById: (id: string) =>
    axiosInstance.get<BackendUser>(API_ENDPOINTS.USERS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformUser(response.data),
    })),

  // Update user
  updateUser: (id: string, data: UpdateUserData) =>
    axiosInstance.put<BackendUser>(API_ENDPOINTS.USERS.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformUser(response.data),
    })),

  // Delete user
  deleteUser: (id: string) => axiosInstance.delete<void>(API_ENDPOINTS.USERS.DELETE(id)),

  // System Settings - Issue Types (via Reference Data)
  getIssueTypes: () => referenceDataApi.getIssueTypes(),

  // System Settings - Priorities (via Reference Data)
  getPriorities: () => referenceDataApi.getPriorities(),

  // System Settings - Statuses (via Reference Data)
  getStatuses: () => referenceDataApi.getStatuses(),

  // System Settings - Labels (via Labels API)
  getLabels: () => labelsApi.getLabels(),

  // System Settings - Create operations
  createIssueType: (data: { name: string; description?: string }) =>
    referenceDataApi.createIssueType(data),

  createPriority: (data: { name: string; orderNum: number }) =>
    referenceDataApi.createPriority(data),

  createStatus: (data: { name: string; category: string; color?: string }) =>
    referenceDataApi.createStatus(data),

  // System Settings - Update/Delete operations
  updateIssueType: (id: string, data: { name?: string; description?: string }) =>
    referenceDataApi.updateIssueType(id, data),

  deleteIssueType: (id: string) => referenceDataApi.deleteIssueType(id),

  updatePriority: (id: string, data: { name?: string; orderNum?: number }) =>
    referenceDataApi.updatePriority(id, data),

  deletePriority: (id: string) => referenceDataApi.deletePriority(id),

  updateStatus: (id: string, data: { name?: string; category?: string; color?: string }) =>
    referenceDataApi.updateStatus(id, data),

  deleteStatus: (id: string) => referenceDataApi.deleteStatus(id),

  updateLabel: (id: string, data: { name?: string; description?: string; color?: string }) =>
    labelsApi.updateLabel(id, data),

  deleteLabel: (id: string) => labelsApi.deleteLabel(id),
};

export default adminApi;


