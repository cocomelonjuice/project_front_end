/**
 * Mock Data for Boards Feature
 * Used for UI testing without backend
 */

import type { Board, BoardColumn } from './states';

// Default board columns (matching common statuses)
export const defaultBoardColumns: BoardColumn[] = [
  {
    id: 'todo',
    name: 'To Do',
    statusIds: ['1', '5'], // To Do, Blocked
    color: '#42526E',
  },
  {
    id: 'inprogress',
    name: 'In Progress',
    statusIds: ['2', '3'], // In Progress, In Review
    color: '#0052CC',
  },
  {
    id: 'done',
    name: 'Done',
    statusIds: ['4'], // Done
    color: '#36B37E',
  },
];

// Mock boards
export const mockBoards: Board[] = [
  {
    id: '1',
    name: 'Default Board',
    projectId: '1',
    columns: defaultBoardColumns,
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



