/**
 * Mock Data for Sprints Feature
 * Used for UI testing without backend
 */

import type { Sprint } from './states';

// Mock sprints
export const mockSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 1 - Authentication',
    goal: 'Implement user authentication and authorization',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'closed',
    boardId: '1',
  },
  {
    id: '2',
    name: 'Sprint 2 - Core Features',
    goal: 'Build core project and issue management features',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    status: 'active',
    boardId: '1',
  },
  {
    id: '3',
    name: 'Sprint 3 - UI Enhancements',
    goal: 'Improve UI/UX and add advanced features',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    status: 'planned',
    boardId: '1',
  },
  {
    id: '4',
    name: 'Sprint 1 - Bug Fixes',
    goal: 'Fix critical bugs and improve stability',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    boardId: '2',
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate next sprint ID
export const getNextSprintId = (): string => {
  const maxId = mockSprints.reduce((max, sprint) => {
    const numId = parseInt(sprint.id);
    return numId > max ? numId : max;
  }, 0);
  return String(maxId + 1);
};

// Helper to format sprint duration
export const formatSprintDuration = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return 'Not scheduled';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${days} days`;
};

// Helper to get sprint status color
export const getSprintStatusColor = (status: Sprint['status']): string => {
  switch (status) {
    case 'planned':
      return '#42526E'; // Gray
    case 'active':
      return '#0052CC'; // Blue
    case 'closed':
      return '#36B37E'; // Green
    default:
      return '#ccc';
  }
};

// Helper to check if sprint is active
export const isSprintActive = (sprint: Sprint): boolean => {
  if (sprint.status !== 'active') return false;
  if (!sprint.startDate || !sprint.endDate) return true;
  const now = new Date();
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  return now >= start && now <= end;
};


