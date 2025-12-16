/**
 * Mock Data for Admin Feature
 * Used for UI testing without backend
 */

import type { AdminUser, Role, SystemSetting } from './states';
import { mockUsers } from '../../../issues/src/store/mockData';

// Mock roles
export const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'admin',
    description: 'Full system access',
    permissions: ['*'],
  },
  {
    id: 'r2',
    name: 'developer',
    description: 'Can create and edit issues',
    permissions: ['issues:create', 'issues:edit', 'issues:view'],
  },
  {
    id: 'r3',
    name: 'viewer',
    description: 'Read-only access',
    permissions: ['issues:view', 'projects:view'],
  },
];

// Mock admin users (extended from mockUsers)
export const mockAdminUsers: AdminUser[] = mockUsers.map((user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName,
  isActive: true,
  roles: [mockRoles[1]], // Default to developer role
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  updatedAt: new Date().toISOString(),
}));

// Mock system settings
export const mockSystemSettings: SystemSetting[] = [
  // Issue Types
  {
    id: 'it1',
    name: 'Bug',
    description: 'Something is not working',
    type: 'issue_type',
  },
  {
    id: 'it2',
    name: 'Task',
    description: 'A task that needs to be done',
    type: 'issue_type',
  },
  {
    id: 'it3',
    name: 'Story',
    description: 'A user story',
    type: 'issue_type',
  },
  // Priorities
  {
    id: 'p1',
    name: 'Lowest',
    orderNum: 1,
    type: 'priority',
  },
  {
    id: 'p2',
    name: 'Low',
    orderNum: 2,
    type: 'priority',
  },
  {
    id: 'p3',
    name: 'Medium',
    orderNum: 3,
    type: 'priority',
  },
  {
    id: 'p4',
    name: 'High',
    orderNum: 4,
    type: 'priority',
  },
  {
    id: 'p5',
    name: 'Highest',
    orderNum: 5,
    type: 'priority',
  },
  // Statuses
  {
    id: 's1',
    name: 'To Do',
    category: 'todo',
    color: '#808080',
    type: 'status',
  },
  {
    id: 's2',
    name: 'In Progress',
    category: 'in_progress',
    color: '#0052CC',
    type: 'status',
  },
  {
    id: 's3',
    name: 'Done',
    category: 'done',
    color: '#36B37E',
    type: 'status',
  },
  // Labels
  {
    id: 'l1',
    name: 'frontend',
    color: '#FF5733',
    description: 'Frontend related',
    type: 'label',
  },
  {
    id: 'l2',
    name: 'backend',
    color: '#33C3F0',
    description: 'Backend related',
    type: 'label',
  },
  {
    id: 'l3',
    name: 'bug',
    color: '#FF0000',
    description: 'Bug fix',
    type: 'label',
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


