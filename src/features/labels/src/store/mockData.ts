/**
 * Mock Data for Labels Feature
 * Used for UI testing without backend
 */

import type { Label } from './states';

// Default color palette for labels
const defaultColors = [
  '#7C3AED', // Purple
  '#1D4ED8', // Blue
  '#15803D', // Green
  '#0F766E', // Teal
  '#D97706', // Amber
  '#DC2626', // Red
  '#475569', // Slate
  '#0369A1', // Sky
  '#6D28D9', // Violet
  '#BE185D', // Rose
];

// Mock labels
export const mockLabels: Label[] = [
  {
    id: '1',
    name: 'bug',
    color: '#DC2626',
    description: 'Something is not working',
  },
  {
    id: '2',
    name: 'feature',
    color: '#1D4ED8',
    description: 'New feature or enhancement',
  },
  {
    id: '3',
    name: 'documentation',
    color: '#0369A1',
    description: 'Documentation related',
  },
  {
    id: '4',
    name: 'urgent',
    color: '#991B1B',
    description: 'Requires immediate attention',
  },
  {
    id: '5',
    name: 'backend',
    color: '#0F766E',
    description: 'Backend related work',
  },
  {
    id: '6',
    name: 'frontend',
    color: '#6D28D9',
    description: 'Frontend related work',
  },
  {
    id: '7',
    name: 'testing',
    color: '#D97706',
    description: 'Testing related',
  },
  {
    id: '8',
    name: 'refactor',
    color: '#475569',
    description: 'Code refactoring',
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate next label ID
export const getNextLabelId = (): string => {
  const maxId = mockLabels.reduce((max, label) => {
    const numId = parseInt(label.id);
    return numId > max ? numId : max;
  }, 0);
  return String(maxId + 1);
};

// Helper to get a random color from default colors
export const getRandomColor = (): string => {
  return defaultColors[Math.floor(Math.random() * defaultColors.length)];
};

// Helper to validate hex color
export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

