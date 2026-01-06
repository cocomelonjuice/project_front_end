/**
 * Mock Data for Labels Feature
 * Used for UI testing without backend
 */

import type { Label } from './states';

// Default color palette for labels
const defaultColors = [
  '#FF5733', // Red
  '#33FF57', // Green
  '#3357FF', // Blue
  '#FF33F5', // Magenta
  '#F5FF33', // Yellow
  '#33FFF5', // Cyan
  '#FF8C33', // Orange
  '#8C33FF', // Purple
  '#33FF8C', // Light Green
  '#FF338C', // Pink
];

// Mock labels
export const mockLabels: Label[] = [
  {
    id: '1',
    name: 'bug',
    color: '#FF5733',
    description: 'Something is not working',
  },
  {
    id: '2',
    name: 'feature',
    color: '#33FF57',
    description: 'New feature or enhancement',
  },
  {
    id: '3',
    name: 'documentation',
    color: '#3357FF',
    description: 'Documentation related',
  },
  {
    id: '4',
    name: 'urgent',
    color: '#FF33F5',
    description: 'Requires immediate attention',
  },
  {
    id: '5',
    name: 'backend',
    color: '#F5FF33',
    description: 'Backend related work',
  },
  {
    id: '6',
    name: 'frontend',
    color: '#33FFF5',
    description: 'Frontend related work',
  },
  {
    id: '7',
    name: 'testing',
    color: '#FF8C33',
    description: 'Testing related',
  },
  {
    id: '8',
    name: 'refactor',
    color: '#8C33FF',
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

