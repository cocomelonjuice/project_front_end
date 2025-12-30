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

  // Priorities
  getPriorities: () =>
    axiosInstance.get<Priority[]>(API_ENDPOINTS.PRIORITIES.GET_ALL),

  getPriorityById: (id: string) =>
    axiosInstance.get<Priority>(API_ENDPOINTS.PRIORITIES.GET_BY_ID(id)),

  // Statuses
  getStatuses: () =>
    axiosInstance.get<Status[]>(API_ENDPOINTS.STATUSES.GET_ALL),

  getStatusById: (id: string) =>
    axiosInstance.get<Status>(API_ENDPOINTS.STATUSES.GET_BY_ID(id)),
};

export default referenceDataApi;







