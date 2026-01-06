/**
 * Labels Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformLabel, transformLabels } from './apiTransformers';
import type { Label, CreateLabelData, UpdateLabelData } from './states';

// Backend Label response structure
interface BackendLabel {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

export const labelsApi = {
  // Create label
  createLabel: (data: CreateLabelData) =>
    axiosInstance.post<BackendLabel>(API_ENDPOINTS.LABELS.CREATE, data).then((response) => ({
      ...response,
      data: transformLabel(response.data),
    })),

  // Get all labels
  getLabels: () =>
    axiosInstance.get<BackendLabel[]>(API_ENDPOINTS.LABELS.GET_ALL).then((response) => ({
      ...response,
      data: transformLabels(response.data || []),
    })),

  // Get label by ID
  getLabelById: (id: string) =>
    axiosInstance.get<BackendLabel>(API_ENDPOINTS.LABELS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformLabel(response.data),
    })),

  // Update label
  updateLabel: (id: string, data: UpdateLabelData) =>
    axiosInstance.put<BackendLabel>(API_ENDPOINTS.LABELS.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformLabel(response.data),
    })),

  // Delete label
  deleteLabel: (id: string) => axiosInstance.delete<void>(API_ENDPOINTS.LABELS.DELETE(id)),

  // Add label to issue
  addLabelToIssue: (issueId: string, labelId: string) =>
    axiosInstance.post(API_ENDPOINTS.LABELS.ADD_TO_ISSUE(issueId, labelId)),

  // Remove label from issue
  removeLabelFromIssue: (issueId: string, labelId: string) =>
    axiosInstance.delete(API_ENDPOINTS.LABELS.REMOVE_FROM_ISSUE(issueId, labelId)),
};

export default labelsApi;

