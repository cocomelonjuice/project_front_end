/**
 * Sprints Feature State
 */

import type { Issue } from '../../issues/src/store/states';
import type { Board } from '../../boards/src/store/states';

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  status: 'planned' | 'active' | 'closed';
  boardId: string;
  board?: Board;
  issues?: Issue[];
}

export interface CreateSprintData {
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planned' | 'active' | 'closed';
  boardId: string;
}

export interface UpdateSprintData {
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status?: 'planned' | 'active' | 'closed';
}

// Initial state
const initialState = {
  sprints: [] as Sprint[],
  currentSprint: null as Sprint | null,
  getSprintsLoading: false,
  getSprintByIdLoading: false,
  createSprintLoading: false,
  updateSprintLoading: false,
  deleteSprintLoading: false,
  startSprintLoading: false,
  completeSprintLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type SprintsState = typeof initialState;
export default initialState;


