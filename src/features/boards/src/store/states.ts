/**
 * Boards Feature State
 */

import type { Issue } from '../../../issues/src/store/states';

export interface BoardColumn {
  id: string;
  name: string;
  statusIds: string[]; // Which statuses belong to this column
  color?: string;
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  type?: string; // 'kanban' or 'scrum'
  columns: BoardColumn[];
}

// Initial state
const initialState = {
  boards: [] as Board[],
  currentBoard: null as Board | null,
  getBoardsLoading: false,
  getBoardByIdLoading: false,
  createBoardLoading: false,
  updateBoardLoading: false,
  deleteBoardLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type BoardsState = typeof initialState;
export default initialState;

