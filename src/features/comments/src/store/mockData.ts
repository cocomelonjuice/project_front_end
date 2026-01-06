/**
 * Mock Data for Comments Feature
 * Used for UI testing without backend
 */

import type { Comment } from './states';
import { mockUsers } from '../../../issues/src/store/mockData';

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is a great feature! Looking forward to seeing it implemented.',
    authorId: '1',
    author: mockUsers[0],
    issueId: '1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    content: 'I can help with the implementation. Let me know when you need assistance.',
    authorId: '2',
    author: mockUsers[1],
    issueId: '1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    content: 'The login button issue has been fixed. Please test and confirm.',
    authorId: '2',
    author: mockUsers[1],
    issueId: '2',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    content: 'File upload feature is working well. Great job!',
    authorId: '3',
    author: mockUsers[2],
    issueId: '4',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    content: 'We should also add drag-and-drop functionality for better UX.',
    authorId: '4',
    author: mockUsers[3],
    issueId: '4',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

