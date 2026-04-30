import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type WorkflowsState } from './states';

export const MODULE_NAME = 'workflows';
export const useSelectorWorkflows = getHookModuleSelector<WorkflowsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getWorkflows
    getWorkflowsRequest(state, _action: any) {
      state.getWorkflowsLoading = true;
      state.errors = null;
    },
    getWorkflowsSuccess(state, { payload }: any) {
      state.getWorkflowsLoading = false;
      state.workflows = payload.data || [];
    },
    getWorkflowsFailure(state, { type, payload }: any) {
      state.getWorkflowsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getWorkflows

    // #region - getWorkflowById
    getWorkflowByIdRequest(state, _action: any) {
      state.getWorkflowLoading = true;
      // Don't clear currentWorkflow - keep it until new one arrives to avoid "not found" flash
      state.errors = null;
    },
    getWorkflowByIdSuccess(state, { payload }: any) {
      state.getWorkflowLoading = false;
      state.currentWorkflow = payload.data;
    },
    getWorkflowByIdFailure(state, { type, payload }: any) {
      state.getWorkflowLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getWorkflowById

    // #region - createWorkflow
    createWorkflowRequest(state, _action: any) {
      state.createWorkflowLoading = true;
      state.errors = null;
    },
    createWorkflowSuccess(state, { payload }: any) {
      state.createWorkflowLoading = false;
      if (payload.data) {
        state.workflows = [...state.workflows, payload.data];
      }
    },
    createWorkflowFailure(state, { type, payload }: any) {
      state.createWorkflowLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createWorkflow

    // #region - updateWorkflow
    updateWorkflowRequest(state, _action: any) {
      state.updateWorkflowLoading = true;
      state.errors = null;
    },
    updateWorkflowSuccess(state, { payload }: any) {
      state.updateWorkflowLoading = false;
      if (payload.data) {
        state.workflows = state.workflows.map((workflow) => (workflow.id === payload.data.id ? payload.data : workflow));
        if (state.currentWorkflow?.id === payload.data.id) {
          state.currentWorkflow = payload.data;
        }
      }
    },
    updateWorkflowFailure(state, { type, payload }: any) {
      state.updateWorkflowLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateWorkflow

    // #region - detachWorkflow
    detachWorkflowRequest(state, _action: any) {
      state.updateWorkflowLoading = true;
      state.errors = null;
    },
    detachWorkflowSuccess(state, { payload }: any) {
      state.updateWorkflowLoading = false;
      if (payload.data) {
        state.workflows = state.workflows.map((workflow) => (workflow.id === payload.data.id ? payload.data : workflow));
        if (state.currentWorkflow?.id === payload.data.id) {
          state.currentWorkflow = payload.data;
        }
      }
    },
    detachWorkflowFailure(state, { type, payload }: any) {
      state.updateWorkflowLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - detachWorkflow

    // #region - deleteWorkflow
    deleteWorkflowRequest(state, _action: any) {
      state.deleteWorkflowLoading = true;
      state.errors = null;
    },
    deleteWorkflowSuccess(state, { payload }: any) {
      state.deleteWorkflowLoading = false;
      if (payload.id) {
        state.workflows = state.workflows.filter((workflow) => workflow.id !== payload.id);
        if (state.currentWorkflow?.id === payload.id) {
          state.currentWorkflow = null;
        }
      }
    },
    deleteWorkflowFailure(state, { type, payload }: any) {
      state.deleteWorkflowLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteWorkflow

    // #region - addTransition
    addTransitionRequest(state, _action: any) {
      state.addTransitionLoading = true;
      state.errors = null;
    },
    addTransitionSuccess(state, { payload }: any) {
      state.addTransitionLoading = false;
      if (payload.data && state.currentWorkflow) {
        // Add transition to current workflow
        if (!state.currentWorkflow.transitions) {
          state.currentWorkflow.transitions = [];
        }
        state.currentWorkflow.transitions.push(payload.data);
        // Also update in workflows list
        const workflowIndex = state.workflows.findIndex((w) => w.id === state.currentWorkflow?.id);
        if (workflowIndex !== -1) {
          if (!state.workflows[workflowIndex].transitions) {
            state.workflows[workflowIndex].transitions = [];
          }
          state.workflows[workflowIndex].transitions!.push(payload.data);
        }
      }
    },
    addTransitionFailure(state, { type, payload }: any) {
      state.addTransitionLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - addTransition

    // #region - deleteTransition
    deleteTransitionRequest(state, _action: any) {
      state.deleteTransitionLoading = true;
      state.errors = null;
    },
    deleteTransitionSuccess(state, { payload }: any) {
      state.deleteTransitionLoading = false;
      if (payload.transitionId && state.currentWorkflow) {
        // Remove transition from current workflow
        if (state.currentWorkflow.transitions) {
          state.currentWorkflow.transitions = state.currentWorkflow.transitions.filter(
            (t) => t.id !== payload.transitionId
          );
        }
        // Also update in workflows list
        const workflowIndex = state.workflows.findIndex((w) => w.id === state.currentWorkflow?.id);
        if (workflowIndex !== -1 && state.workflows[workflowIndex].transitions) {
          state.workflows[workflowIndex].transitions = state.workflows[workflowIndex].transitions!.filter(
            (t) => t.id !== payload.transitionId
          );
        }
      }
    },
    deleteTransitionFailure(state, { type, payload }: any) {
      state.deleteTransitionLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteTransition

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentWorkflow
    setCurrentWorkflow(state, { payload }: any) {
      state.currentWorkflow = payload;
    },
    // #endregion - setCurrentWorkflow
  },
});

export { actions, reducer };

