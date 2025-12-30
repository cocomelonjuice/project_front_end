/**
 * Boards Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { Board } from './states';

// Backend Board response structure
interface BackendBoard {
  id: string;
  name: string;
  type: string; // 'kanban' or 'scrum'
  project: {
    id: string;
  };
}

// Transform backend board to frontend board
const transformBoard = (backendBoard: BackendBoard): Board => {
  return {
    id: backendBoard.id,
    name: backendBoard.name,
    projectId: backendBoard.project.id,
    type: backendBoard.type,
    // Columns are frontend-only, derived from statuses
    // For now, use default columns (will be handled by BoardView component)
    columns: [],
  };
};

export const boardsApi = {
  // Get all boards for a project
  getBoardsByProject: (projectId: string) =>
    axiosInstance.get<BackendBoard[]>(API_ENDPOINTS.BOARDS.GET_BY_PROJECT(projectId)).then((response) => ({
      ...response,
      data: response.data.map(transformBoard),
    })),

  // Get board by ID
  getBoardById: (id: string) =>
    axiosInstance.get<BackendBoard>(API_ENDPOINTS.BOARDS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformBoard(response.data),
    })),

  // Create board
  createBoard: (projectId: string, data: { name: string; type: string }) =>
    axiosInstance.post<BackendBoard>(API_ENDPOINTS.BOARDS.CREATE(projectId), data).then((response) => ({
      ...response,
      data: transformBoard(response.data),
    })),

  // Update board
  updateBoard: (id: string, data: { name?: string; type?: string }) =>
    axiosInstance.put<BackendBoard>(API_ENDPOINTS.BOARDS.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformBoard(response.data),
    })),

  // Delete board
  deleteBoard: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.BOARDS.DELETE(id)),
};

export default boardsApi;

