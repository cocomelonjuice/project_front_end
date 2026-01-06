/**
 * Mock Data for Team Feature
 * Used for UI testing without backend
 */

import type { Role, ProjectTeamMember } from './states';
import { mockUsers } from '../../../issues/src/store/mockData';

// Mock roles
export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Project Admin',
    description: 'Full access to project settings and management',
    permissions: ['manage_project', 'manage_issues', 'manage_team'],
  },
  {
    id: '2',
    name: 'Developer',
    description: 'Can create, edit, and assign issues',
    permissions: ['create_issue', 'edit_issue', 'assign_issue'],
  },
  {
    id: '3',
    name: 'Tester',
    description: 'Can view and test issues',
    permissions: ['view_issue', 'comment_issue'],
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to project',
    permissions: ['view_issue'],
  },
];

// Mock project team members (for projectId '1')
export const mockProjectTeamMembers: ProjectTeamMember[] = [
  {
    userId: '1',
    user: mockUsers[0], // John Doe
    roleId: '1',
    role: mockRoles[0], // Project Admin
  },
  {
    userId: '2',
    user: mockUsers[1], // Jane Smith
    roleId: '2',
    role: mockRoles[1], // Developer
  },
  {
    userId: '3',
    user: mockUsers[2], // Bob Wilson
    roleId: '2',
    role: mockRoles[1], // Developer
  },
  {
    userId: '4',
    user: mockUsers[3], // Alice Brown
    roleId: '3',
    role: mockRoles[2], // Tester
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


