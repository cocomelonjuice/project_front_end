/**
 * Mock Data for Activity Feature
 * Used for UI testing without backend
 */

import type { AuditLog } from './states';
import { mockUsers } from '../../../issues/src/store/mockData';

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    action: 'create',
    entityType: 'issue',
    entityId: '1',
    description: 'Created issue PROJ-1: Implement user authentication',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    action: 'update',
    entityType: 'issue',
    entityId: '1',
    description: 'Updated issue PROJ-1: Changed status from "To Do" to "In Progress"',
    oldValues: { statusId: '1' },
    newValues: { statusId: '2' },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    user: mockUsers[0],
    action: 'create',
    entityType: 'issue',
    entityId: '2',
    description: 'Created issue PROJ-2: Fix login button not working',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: '2',
    user: mockUsers[1],
    action: 'create',
    entityType: 'comment',
    entityId: '1',
    description: 'Added comment to issue PROJ-1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    userId: '3',
    user: mockUsers[2],
    action: 'update',
    entityType: 'issue',
    entityId: '4',
    description: 'Updated issue PROJ-4: Changed assignee to Alice Brown',
    oldValues: { assigneeId: null },
    newValues: { assigneeId: '4' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    userId: '4',
    user: mockUsers[3],
    action: 'create',
    entityType: 'attachment',
    entityId: '1',
    description: 'Uploaded attachment "screenshot.png" to issue PROJ-1',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    userId: '1',
    user: mockUsers[0],
    action: 'update',
    entityType: 'project',
    entityId: '1',
    description: 'Updated project: Changed description',
    oldValues: { description: 'A sample project' },
    newValues: { description: 'A sample project for testing' },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    userId: '2',
    user: mockUsers[1],
    action: 'create',
    entityType: 'sprint',
    entityId: '1',
    description: 'Created sprint "Sprint 1 - Authentication"',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get action icon
export const getActionIcon = (action: string): string => {
  switch (action) {
    case 'create':
      return 'add_circle';
    case 'update':
      return 'edit';
    case 'delete':
      return 'delete';
    case 'assign':
      return 'person_add';
    case 'comment':
      return 'comment';
    default:
      return 'info';
  }
};

// Helper to get action color
export const getActionColor = (action: string): string => {
  switch (action) {
    case 'create':
      return '#36B37E'; // Green
    case 'update':
      return '#0052CC'; // Blue
    case 'delete':
      return '#E53E3E'; // Red
    case 'assign':
      return '#FFAB00'; // Orange
    default:
      return '#42526E'; // Gray
  }
};


