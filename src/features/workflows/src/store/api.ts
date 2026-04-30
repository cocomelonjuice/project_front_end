/**
 * Workflows Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformWorkflow, transformWorkflows, transformWorkflowTransition, transformWorkflowTransitions } from './apiTransformers';

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
  workflow: {
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

export interface CreateWorkflowData {
  name: string;
  description?: string;
  projectId: string;
  isActive?: boolean;
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  projectId?: string;
  isActive?: boolean;
}

export interface CreateTransitionData {
  fromStatusId: string;
  toStatusId: string;
}

export const workflowsApi = {
  // Create workflow
  createWorkflow: (data: CreateWorkflowData) =>
    axiosInstance.post<BackendWorkflow>(API_ENDPOINTS.WORKFLOWS.CREATE, data).then((response) => ({
      ...response,
      data: transformWorkflow(response.data),
    })),

  // Get all workflows
  getWorkflows: () =>
    axiosInstance.get<BackendWorkflow[]>(API_ENDPOINTS.WORKFLOWS.GET_ALL).then((response) => ({
      ...response,
      data: transformWorkflows(response.data || []),
    })),

  // Get workflow by ID
  getWorkflowById: (id: string) =>
    axiosInstance.get<BackendWorkflow>(API_ENDPOINTS.WORKFLOWS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformWorkflow(response.data),
    })),

  // Get workflow by project ID
  getWorkflowByProjectId: (projectId: string) =>
    axiosInstance.get<BackendWorkflow | null>(API_ENDPOINTS.WORKFLOWS.GET_BY_PROJECT(projectId)).then((response) => ({
      ...response,
      data: response.data ? transformWorkflow(response.data) : null,
    })),

  // Update workflow
  updateWorkflow: (id: string, data: UpdateWorkflowData) =>
    axiosInstance.put<BackendWorkflow>(API_ENDPOINTS.WORKFLOWS.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformWorkflow(response.data),
    })),

  // Delete workflow
  deleteWorkflow: (id: string) => axiosInstance.delete<void>(API_ENDPOINTS.WORKFLOWS.DELETE(id)),

  // Detach workflow from assigned project
  detachWorkflow: (id: string) =>
    axiosInstance.post<BackendWorkflow>(API_ENDPOINTS.WORKFLOWS.DETACH(id)).then((response) => ({
      ...response,
      data: transformWorkflow(response.data),
    })),

  // Get transitions for a workflow
  getTransitions: (id: string) =>
    axiosInstance.get<BackendWorkflowTransition[]>(API_ENDPOINTS.WORKFLOWS.GET_TRANSITIONS(id)).then((response) => ({
      ...response,
      data: transformWorkflowTransitions(response.data || [], id),
    })),

  // Add transition to workflow
  addTransition: (id: string, data: CreateTransitionData) =>
    axiosInstance.post<BackendWorkflowTransition>(API_ENDPOINTS.WORKFLOWS.ADD_TRANSITION(id), data).then((response) => ({
      ...response,
      data: transformWorkflowTransition(response.data, id),
    })),

  // Delete transition from workflow
  deleteTransition: (id: string, transitionId: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.WORKFLOWS.DELETE_TRANSITION(id, transitionId)),
};

export default workflowsApi;

