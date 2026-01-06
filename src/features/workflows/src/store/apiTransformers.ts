/**
 * API Transformers for Workflows
 * Transforms backend API responses to frontend format
 */

import type { Workflow, WorkflowTransition } from './states';
import type { Status } from '../../../issues/src/store/states';

// Backend Workflow response structure
interface BackendWorkflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  project?: {
    id: string;
  } | null;
  transitions?: BackendWorkflowTransition[];
}

interface BackendWorkflowTransition {
  id: string;
  workflow?: {
    id: string;
  };
  fromStatus: {
    id: string;
    name: string;
    color?: string;
    category?: string;
  };
  toStatus: {
    id: string;
    name: string;
    color?: string;
    category?: string;
  };
}

/**
 * Transform backend transition to frontend transition
 * @param backendTransition - The backend transition object
 * @param workflowId - Optional workflow ID (used when workflow object is not in transition)
 */
const transformTransition = (backendTransition: BackendWorkflowTransition, workflowId?: string): WorkflowTransition => {
  return {
    id: backendTransition.id,
    workflowId: backendTransition.workflow?.id || workflowId || '',
    fromStatusId: backendTransition.fromStatus.id,
    fromStatus: {
      id: backendTransition.fromStatus.id,
      name: backendTransition.fromStatus.name,
      color: backendTransition.fromStatus.color,
      category: backendTransition.fromStatus.category,
    } as Status,
    toStatusId: backendTransition.toStatus.id,
    toStatus: {
      id: backendTransition.toStatus.id,
      name: backendTransition.toStatus.name,
      color: backendTransition.toStatus.color,
      category: backendTransition.toStatus.category,
    } as Status,
  };
};

/**
 * Transform backend workflow to frontend workflow
 */
export const transformWorkflow = (backendWorkflow: BackendWorkflow): Workflow => {
  return {
    id: backendWorkflow.id,
    projectId: backendWorkflow.project?.id || null,
    name: backendWorkflow.name,
    description: backendWorkflow.description,
    isActive: backendWorkflow.isActive,
    transitions: backendWorkflow.transitions?.map((transition) => transformTransition(transition, backendWorkflow.id)) || [],
  };
};

/**
 * Transform array of backend workflows to frontend workflows
 */
export const transformWorkflows = (backendWorkflows: BackendWorkflow[]): Workflow[] => {
  return backendWorkflows.map(transformWorkflow);
};

/**
 * Transform backend transition to frontend transition (standalone)
 * @param backendTransition - The backend transition object
 * @param workflowId - Optional workflow ID (used when workflow object is not in transition)
 */
export const transformWorkflowTransition = (backendTransition: BackendWorkflowTransition, workflowId?: string): WorkflowTransition => {
  return transformTransition(backendTransition, workflowId);
};

/**
 * Transform array of backend transitions to frontend transitions
 * @param backendTransitions - Array of backend transitions
 * @param workflowId - Optional workflow ID (used when workflow object is not in transitions)
 */
export const transformWorkflowTransitions = (backendTransitions: BackendWorkflowTransition[], workflowId?: string): WorkflowTransition[] => {
  return backendTransitions.map((transition) => transformTransition(transition, workflowId));
};

