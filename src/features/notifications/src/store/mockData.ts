/**
 * Mock Data for Notifications Feature
 * Used for UI testing without backend
 */

import type { Notification } from './states';
import { mockIssues } from '../../../issues/src/store/mockData';

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    issueId: '1',
    issue: mockIssues[0],
    title: 'Issue assigned to you',
    message: 'PROJ-1: Implement user authentication has been assigned to you',
    type: 'issue_assigned',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    userId: '1',
    issueId: '1',
    issue: mockIssues[0],
    title: 'New comment on issue',
    message: 'Jane Smith commented on PROJ-1: Implement user authentication',
    type: 'comment_added',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    userId: '1',
    issueId: '2',
    issue: mockIssues[1],
    title: 'Status changed',
    message: 'PROJ-2: Fix login button not working status changed to "In Progress"',
    type: 'status_changed',
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    userId: '1',
    issueId: '4',
    issue: mockIssues[3],
    title: 'New attachment',
    message: 'Alice Brown uploaded an attachment to PROJ-4: Add file upload feature',
    type: 'attachment_added',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: '5',
    userId: '1',
    issueId: '1',
    issue: mockIssues[0],
    title: 'Issue updated',
    message: 'PROJ-1: Implement user authentication has been updated',
    type: 'issue_updated',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to get notification icon based on type
export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'issue_assigned':
      return 'person_add';
    case 'comment_added':
      return 'comment';
    case 'status_changed':
      return 'swap_horiz';
    case 'attachment_added':
      return 'attach_file';
    case 'issue_updated':
      return 'edit';
    default:
      return 'notifications';
  }
};

// Helper to get notification color based on type
export const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'issue_assigned':
      return '#0052CC'; // Blue
    case 'comment_added':
      return '#36B37E'; // Green
    case 'status_changed':
      return '#FFAB00'; // Orange
    case 'attachment_added':
      return '#7B68EE'; // Purple
    case 'issue_updated':
      return '#42526E'; // Gray
    default:
      return '#ccc';
  }
};

