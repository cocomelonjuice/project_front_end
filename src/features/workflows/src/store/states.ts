/**
 * Workflows Feature State
 */

import type { Status } from '../../issues/src/store/states';

export interface WorkflowTransition {
  id: string;
  workflowId: string;
  fromStatusId: string;
  fromStatus?: Status;
  toStatusId: string;
  toStatus?: Status;
}

export interface Workflow {
  id: string;
  projectId?: string | null;
  name: string;
  description?: string;
  isActive: boolean;
  transitions?: WorkflowTransition[];
}

// Initial state
const initialState = {
  workflows: [] as Workflow[],
  currentWorkflow: null as Workflow | null,
  getWorkflowsLoading: false,
  getWorkflowLoading: false,
  createWorkflowLoading: false,
  updateWorkflowLoading: false,
  deleteWorkflowLoading: false,
  addTransitionLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type WorkflowsState = typeof initialState;
export default initialState;


