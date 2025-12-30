/**
 * Sprints Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { CreateSprintData, UpdateSprintData } from './states';

export const sprintsApi = {
  // Create sprint for a board
  createSprint: (boardId: string, data: CreateSprintData) =>
    axiosInstance.post(API_ENDPOINTS.SPRINTS.CREATE(boardId), data),

  // Get all sprints for a board
  getSprintsByBoard: (boardId: string) =>
    axiosInstance.get(API_ENDPOINTS.SPRINTS.GET_BY_BOARD(boardId)),

  // Get sprint by ID
  getSprintById: (id: string) =>
    axiosInstance.get(API_ENDPOINTS.SPRINTS.GET_BY_ID(id)),

  // Update sprint
  updateSprint: (id: string, data: UpdateSprintData) =>
    axiosInstance.put(API_ENDPOINTS.SPRINTS.UPDATE(id), data),

  // Delete sprint
  deleteSprint: (id: string) =>
    axiosInstance.delete(API_ENDPOINTS.SPRINTS.DELETE(id)),

  // Start sprint
  startSprint: (id: string) =>
    axiosInstance.post(API_ENDPOINTS.SPRINTS.START(id)),

  // Complete sprint
  completeSprint: (id: string) =>
    axiosInstance.post(API_ENDPOINTS.SPRINTS.COMPLETE(id)),

  // Get issues by sprint
  getIssuesBySprint: (sprintId: string) =>
    axiosInstance.get(API_ENDPOINTS.SPRINTS.GET_ISSUES(sprintId)),
};

export default sprintsApi;








