/**
 * Mock Data for Projects Feature
 * Used for UI testing without backend
 */

export interface Project {
  id: string;
  key: string;
  name: string;
  type: string;
  description?: string;
  lead?: { name: string; avatar: string };
  starred?: boolean;
}

// Mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    key: 'PROJ',
    name: 'Sample Project',
    type: 'software',
    description: 'A sample project for testing',
    lead: { name: 'John Doe', avatar: 'JD' },
    starred: false,
  },
  {
    id: '2',
    key: 'DEV',
    name: 'Development Project',
    type: 'business',
    description: 'Development team project',
    lead: { name: 'Jane Smith', avatar: 'JS' },
    starred: true,
  },
  {
    id: '3',
    key: 'TEST',
    name: 'Test Project',
    type: 'software',
    description: 'Testing project',
    lead: { name: 'Bob Wilson', avatar: 'BW' },
    starred: false,
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



