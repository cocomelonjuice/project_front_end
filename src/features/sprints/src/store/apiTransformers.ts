/**
 * API Transformers for Sprints
 * Transform backend API responses to frontend format
 */

import type { Sprint } from './states';

/**
 * Backend Sprint entity structure (from TypeORM)
 */
interface BackendSprint {
  id: string;
  name: string;
  goal?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status: string;
  board?: {
    id: string;
    name?: string;
  };
  board_id?: string;
  issues?: any[];
}

/**
 * Transform backend sprint to frontend format
 */
export const transformSprint = (backendSprint: BackendSprint): Sprint => {
  // Extract boardId - check multiple possible locations
  const boardId = backendSprint.board?.id || 
                  (backendSprint as any).board_id || 
                  (backendSprint.board as any)?.id || 
                  '';
  
  // Debug log if boardId is missing
  if (!boardId) {
    console.warn('🔴 Sprint missing boardId:', {
      sprintId: backendSprint.id,
      sprintName: backendSprint.name,
      board: backendSprint.board,
      board_id: (backendSprint as any).board_id,
      fullSprint: backendSprint,
    });
  }

  return {
    id: backendSprint.id,
    name: backendSprint.name,
    goal: backendSprint.goal || undefined,
    startDate: backendSprint.startDate
      ? typeof backendSprint.startDate === 'string'
        ? backendSprint.startDate
        : backendSprint.startDate.toISOString()
      : undefined,
    endDate: backendSprint.endDate
      ? typeof backendSprint.endDate === 'string'
        ? backendSprint.endDate
        : backendSprint.endDate.toISOString()
      : undefined,
    status: (backendSprint.status as 'planned' | 'active' | 'closed') || 'planned',
    boardId: boardId,
    board: backendSprint.board
      ? {
          id: backendSprint.board.id,
          name: backendSprint.board.name,
        }
      : undefined,
    issues: backendSprint.issues || undefined,
  };
};

/**
 * Transform array of backend sprints to frontend format
 */
export const transformSprints = (backendSprints: BackendSprint[]): Sprint[] => {
  return backendSprints.map(transformSprint);
};





