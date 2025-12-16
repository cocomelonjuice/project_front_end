/**
 * Mock Data for Workflows Feature
 * Used for UI testing without backend
 */

import type { Workflow, WorkflowTransition } from './states';
import { mockStatuses } from '../../../issues/src/store/mockData';

// Mock workflow transitions
const mockTransitions1: WorkflowTransition[] = [
  {
    id: 't1',
    workflowId: 'w1',
    fromStatusId: 's1', // To Do
    fromStatus: mockStatuses[0],
    toStatusId: 's2', // In Progress
    toStatus: mockStatuses[1],
  },
  {
    id: 't2',
    workflowId: 'w1',
    fromStatusId: 's2', // In Progress
    fromStatus: mockStatuses[1],
    toStatusId: 's3', // Done
    toStatus: mockStatuses[2],
  },
  {
    id: 't3',
    workflowId: 'w1',
    fromStatusId: 's2', // In Progress
    fromStatus: mockStatuses[1],
    toStatusId: 's1', // Back to To Do
    toStatus: mockStatuses[0],
  },
  {
    id: 't4',
    workflowId: 'w1',
    fromStatusId: 's3', // Done
    fromStatus: mockStatuses[2],
    toStatusId: 's2', // Back to In Progress
    toStatus: mockStatuses[1],
  },
];

const mockTransitions2: WorkflowTransition[] = [
  {
    id: 't5',
    workflowId: 'w2',
    fromStatusId: 's1', // To Do
    fromStatus: mockStatuses[0],
    toStatusId: 's2', // In Progress
    toStatus: mockStatuses[1],
  },
  {
    id: 't6',
    workflowId: 'w2',
    fromStatusId: 's2', // In Progress
    fromStatus: mockStatuses[1],
    toStatusId: 's3', // Done
    toStatus: mockStatuses[2],
  },
];

// Mock workflows
export const mockWorkflows: Workflow[] = [
  {
    id: 'w1',
    projectId: null, // Global workflow
    name: 'Default Workflow',
    description: 'Standard workflow for all projects',
    isActive: true,
    transitions: mockTransitions1,
  },
  {
    id: 'w2',
    projectId: '1', // Project-specific workflow
    name: 'Project 1 Workflow',
    description: 'Custom workflow for Project 1',
    isActive: true,
    transitions: mockTransitions2,
  },
  {
    id: 'w3',
    projectId: null,
    name: 'Simple Workflow',
    description: 'A simplified workflow with fewer transitions',
    isActive: false,
    transitions: [],
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = true;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


