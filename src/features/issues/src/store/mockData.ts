/**
 * Mock Data for Issues Feature
 * Used for UI testing without backend
 */

import type { Issue, IssueType, Priority, Status, User } from './states';

// Mock users
export const mockUsers: User[] = [
  { id: '1', username: 'john.doe', email: 'john@example.com', displayName: 'John Doe' },
  { id: '2', username: 'jane.smith', email: 'jane@example.com', displayName: 'Jane Smith' },
  { id: '3', username: 'bob.wilson', email: 'bob@example.com', displayName: 'Bob Wilson' },
  { id: '4', username: 'alice.brown', email: 'alice@example.com', displayName: 'Alice Brown' },
];

// Mock issue types
export const mockIssueTypes: IssueType[] = [
  { id: '1', name: 'Story', icon: '📖', color: '#0052CC' },
  { id: '2', name: 'Task', icon: '✓', color: '#2684FF' },
  { id: '3', name: 'Bug', icon: '🐛', color: '#E53E3E' },
  { id: '4', name: 'Epic', icon: '⚡', color: '#7B68EE' },
];

// Mock priorities
export const mockPriorities: Priority[] = [
  { id: '1', name: 'Highest', color: '#E53E3E', level: 1 },
  { id: '2', name: 'High', color: '#DD6B20', level: 2 },
  { id: '3', name: 'Medium', color: '#D69E2E', level: 3 },
  { id: '4', name: 'Low', color: '#38A169', level: 4 },
  { id: '5', name: 'Lowest', color: '#718096', level: 5 },
];

// Mock statuses
export const mockStatuses: Status[] = [
  { id: '1', name: 'To Do', color: '#42526E', category: 'todo' },
  { id: '2', name: 'In Progress', color: '#0052CC', category: 'inprogress' },
  { id: '3', name: 'In Review', color: '#FFAB00', category: 'inprogress' },
  { id: '4', name: 'Done', color: '#36B37E', category: 'done' },
  { id: '5', name: 'Blocked', color: '#DE350B', category: 'todo' },
];

// Mock issues
export const mockIssues: Issue[] = [
  {
    id: '1',
    key: 'PROJ-1',
    summary: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    typeId: '1',
    type: mockIssueTypes[0],
    priorityId: '2',
    priority: mockPriorities[1],
    statusId: '2',
    status: mockStatuses[1],
    assigneeId: '1',
    assignee: mockUsers[0],
    reporterId: '2',
    reporter: mockUsers[1],
    projectId: '1',
    labelIds: ['2', '5'], // feature, backend
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    key: 'PROJ-2',
    summary: 'Fix login button not working',
    description: 'The login button on the homepage does not trigger the login modal',
    typeId: '3',
    type: mockIssueTypes[2],
    priorityId: '1',
    priority: mockPriorities[0],
    statusId: '1',
    status: mockStatuses[0],
    assigneeId: '2',
    assignee: mockUsers[1],
    reporterId: '3',
    reporter: mockUsers[2],
    projectId: '1',
    labelIds: ['1', '4'], // bug, urgent
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    key: 'PROJ-3',
    summary: 'Create project dashboard',
    description: 'Build a dashboard showing project statistics and recent activity',
    typeId: '1',
    type: mockIssueTypes[0],
    priorityId: '3',
    priority: mockPriorities[2],
    statusId: '4',
    status: mockStatuses[3],
    assigneeId: '3',
    assignee: mockUsers[2],
    reporterId: '1',
    reporter: mockUsers[0],
    projectId: '1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    key: 'PROJ-4',
    summary: 'Add file upload feature',
    description: 'Allow users to upload attachments to issues',
    typeId: '2',
    type: mockIssueTypes[1],
    priorityId: '4',
    priority: mockPriorities[3],
    statusId: '3',
    status: mockStatuses[2],
    assigneeId: '4',
    assignee: mockUsers[3],
    reporterId: '2',
    reporter: mockUsers[1],
    projectId: '1',
    labelIds: ['2', '6', '7'], // feature, frontend, testing
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    key: 'PROJ-5',
    summary: 'Design new UI components',
    description: 'Create reusable UI components for the application',
    typeId: '2',
    type: mockIssueTypes[1],
    priorityId: '3',
    priority: mockPriorities[2],
    statusId: '2',
    status: mockStatuses[1],
    assigneeId: '1',
    assignee: mockUsers[0],
    reporterId: '4',
    reporter: mockUsers[3],
    projectId: '1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get next issue key
export const getNextIssueKey = (projectKey: string, existingIssues: Issue[]): string => {
  const projectIssues = existingIssues.filter((issue) => issue.key.startsWith(projectKey));
  if (projectIssues.length === 0) return `${projectKey}-1`;
  const numbers = projectIssues.map((issue) => {
    const num = parseInt(issue.key.split('-')[1], 10);
    return isNaN(num) ? 0 : num;
  });
  const maxNum = Math.max(...numbers);
  return `${projectKey}-${maxNum + 1}`;
};
