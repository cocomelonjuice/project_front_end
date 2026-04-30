import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import workflowsApi from './api';
import { USE_MOCK_DATA, mockWorkflows, delay, getNextWorkflowId } from './mockData';
import type { Workflow, WorkflowTransition, CreateWorkflowData, UpdateWorkflowData, CreateTransitionData } from './api';

/**
 * Workflows Feature Sagas
 */

const sagas = {
  // #region - getWorkflows
  *getWorkflowsWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getWorkflowsSuccess({ data: mockWorkflows } as any));
        payload.callback?.onSuccess?.(mockWorkflows);
      } else {
        const response = yield call(workflowsApi.getWorkflows);
        yield put(actions.getWorkflowsSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch workflows';
      yield put(actions.getWorkflowsFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getWorkflows

  // #region - getWorkflowById
  *getWorkflowByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const workflow = mockWorkflows.find((w) => w.id === payload.data.id);
        if (workflow) {
          yield put(actions.getWorkflowByIdSuccess({ data: workflow } as any));
          payload.callback?.onSuccess?.(workflow);
        } else {
          throw new Error('Workflow not found');
        }
      } else {
        const response = yield call(workflowsApi.getWorkflowById, payload.data.id);
        yield put(actions.getWorkflowByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch workflow';
      yield put(actions.getWorkflowByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getWorkflowById

  // #region - createWorkflow
  *createWorkflowWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateWorkflowData = payload.data;
        const newWorkflow: Workflow = {
          id: getNextWorkflowId(),
          name: data.name,
          description: data.description,
          projectId: data.projectId || null,
          isActive: data.isActive ?? true,
          transitions: [],
        };
        mockWorkflows.push(newWorkflow);
        yield put(actions.createWorkflowSuccess({ data: newWorkflow } as any));
        payload.callback?.onSuccess?.(newWorkflow);
      } else {
        const response = yield call(workflowsApi.createWorkflow, payload.data);
        yield put(actions.createWorkflowSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create workflow';
      yield put(actions.createWorkflowFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createWorkflow

  // #region - updateWorkflow
  *updateWorkflowWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateWorkflowData = payload.data;
        const workflowIndex = mockWorkflows.findIndex((w) => w.id === id);
        if (workflowIndex === -1) throw new Error('Workflow not found');

        const updatedWorkflow: Workflow = {
          ...mockWorkflows[workflowIndex],
          ...updateData,
        };

        mockWorkflows[workflowIndex] = updatedWorkflow;

        yield put(actions.updateWorkflowSuccess({ data: updatedWorkflow } as any));
        payload.callback?.onSuccess?.(updatedWorkflow);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(workflowsApi.updateWorkflow, id, updateData);
        yield put(actions.updateWorkflowSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update workflow';
      yield put(actions.updateWorkflowFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateWorkflow

  // #region - detachWorkflow
  *detachWorkflowWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(250);
        const workflow = mockWorkflows.find((w) => w.id === payload.data.id);
        if (!workflow) throw new Error('Workflow not found');
        workflow.projectId = null;
        workflow.isActive = false;
        yield put(actions.detachWorkflowSuccess({ data: workflow } as any));
        payload.callback?.onSuccess?.(workflow);
      } else {
        const response = yield call(workflowsApi.detachWorkflow, payload.data.id);
        yield put(actions.detachWorkflowSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to detach workflow';
      yield put(actions.detachWorkflowFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - detachWorkflow

  // #region - deleteWorkflow
  *deleteWorkflowWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockWorkflows.findIndex((w) => w.id === id);
        if (index !== -1) {
          mockWorkflows.splice(index, 1);
        }
        yield put(actions.deleteWorkflowSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(workflowsApi.deleteWorkflow, payload.data.id);
        yield put(actions.deleteWorkflowSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete workflow';
      yield put(actions.deleteWorkflowFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteWorkflow

  // #region - addTransition
  *addTransitionWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { workflowId, ...transitionData }: { workflowId: string } & CreateTransitionData = payload.data;
        const workflow = mockWorkflows.find((w) => w.id === workflowId);
        if (!workflow) throw new Error('Workflow not found');

        const newTransition: WorkflowTransition = {
          id: `t${Date.now()}`,
          workflowId,
          fromStatusId: transitionData.fromStatusId,
          toStatusId: transitionData.toStatusId,
        };

        if (!workflow.transitions) {
          workflow.transitions = [];
        }
        workflow.transitions.push(newTransition);

        yield put(actions.addTransitionSuccess({ data: newTransition } as any));
        payload.callback?.onSuccess?.(newTransition);
      } else {
        const { workflowId, ...transitionData } = payload.data;
        const response = yield call(workflowsApi.addTransition, workflowId, transitionData);
        yield put(actions.addTransitionSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add transition';
      yield put(actions.addTransitionFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
      }
    },
    // #endregion - addTransition

    // #region - deleteTransition
    *deleteTransitionWorker({ payload }: any) {
      try {
        if (USE_MOCK_DATA) {
          yield delay(300);
          const { workflowId, transitionId } = payload.data;
          const workflow = mockWorkflows.find((w) => w.id === workflowId);
          if (workflow && workflow.transitions) {
            const index = workflow.transitions.findIndex((t) => t.id === transitionId);
            if (index !== -1) {
              workflow.transitions.splice(index, 1);
            }
          }
          yield put(actions.deleteTransitionSuccess({ transitionId } as any));
          payload.callback?.onSuccess?.();
        } else {
          const { workflowId, transitionId } = payload.data;
          yield call(workflowsApi.deleteTransition, workflowId, transitionId);
          yield put(actions.deleteTransitionSuccess({ transitionId } as any));
          payload.callback?.onSuccess?.();
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete transition';
        yield put(actions.deleteTransitionFailure(errorMessage));
        payload.callback?.onError?.(error);
      } finally {
        payload.callback?.onFinally?.();
      }
    },
    // #endregion - deleteTransition
};

const sagaWatcher = [
  takeLatest(actions.getWorkflowsRequest.type, sagas.getWorkflowsWorker),
  takeLatest(actions.getWorkflowByIdRequest.type, sagas.getWorkflowByIdWorker),
  takeLatest(actions.createWorkflowRequest.type, sagas.createWorkflowWorker),
  takeLatest(actions.updateWorkflowRequest.type, sagas.updateWorkflowWorker),
  takeLatest(actions.detachWorkflowRequest.type, sagas.detachWorkflowWorker),
  takeLatest(actions.deleteWorkflowRequest.type, sagas.deleteWorkflowWorker),
  takeLatest(actions.addTransitionRequest.type, sagas.addTransitionWorker),
  takeLatest(actions.deleteTransitionRequest.type, sagas.deleteTransitionWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}

