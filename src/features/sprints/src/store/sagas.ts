import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import sprintsApi from './api';
import { transformSprint, transformSprints } from './apiTransformers';
import { USE_MOCK_DATA, mockSprints, delay, getNextSprintId } from './mockData';
import type { Sprint, CreateSprintData, UpdateSprintData } from './states';

/**
 * Sprints Feature Sagas
 */

const sagas = {
  // #region - getSprintsByBoard
  *getSprintsByBoardWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { boardId } = payload.data || {};
        const filtered = mockSprints.filter((sprint) => sprint.boardId === boardId);
        yield put(actions.getSprintsByBoardSuccess({ data: filtered } as any));
        payload.callback?.onSuccess?.(filtered);
      } else {
        const response = yield call(sprintsApi.getSprintsByBoard, payload.data.boardId);
        const transformed = transformSprints(response.data || []);
        yield put(actions.getSprintsByBoardSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch sprints';
      yield put(actions.getSprintsByBoardFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getSprintsByBoard

  // #region - getSprintById
  *getSprintByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const sprint = mockSprints.find((s) => s.id === payload.data.id);
        if (sprint) {
          yield put(actions.getSprintByIdSuccess({ data: sprint } as any));
          payload.callback?.onSuccess?.(sprint);
        } else {
          throw new Error('Sprint not found');
        }
      } else {
        const response = yield call(sprintsApi.getSprintById, payload.data.id);
        const transformed = transformSprint(response.data);
        yield put(actions.getSprintByIdSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch sprint';
      yield put(actions.getSprintByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getSprintById

  // #region - createSprint
  *createSprintWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateSprintData = payload.data;
        const newSprint: Sprint = {
          id: getNextSprintId(),
          name: data.name,
          goal: data.goal,
          startDate: data.startDate,
          endDate: data.endDate,
          status: data.status || 'planned',
          boardId: data.boardId,
        };
        mockSprints.push(newSprint);
        yield put(actions.createSprintSuccess({ data: newSprint } as any));
        payload.callback?.onSuccess?.(newSprint);
      } else {
        const { boardId, ...sprintData } = payload.data;
        const response = yield call(sprintsApi.createSprint, boardId, sprintData);
        const transformed = transformSprint(response.data);
        yield put(actions.createSprintSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create sprint';
      yield put(actions.createSprintFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createSprint

  // #region - updateSprint
  *updateSprintWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateSprintData = payload.data;
        const sprintIndex = mockSprints.findIndex((s) => s.id === id);
        if (sprintIndex === -1) throw new Error('Sprint not found');

        const updatedSprint: Sprint = {
          ...mockSprints[sprintIndex],
          ...updateData,
        };
        mockSprints[sprintIndex] = updatedSprint;
        yield put(actions.updateSprintSuccess({ data: updatedSprint } as any));
        payload.callback?.onSuccess?.(updatedSprint);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(sprintsApi.updateSprint, id, updateData);
        const transformed = transformSprint(response.data);
        yield put(actions.updateSprintSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update sprint';
      yield put(actions.updateSprintFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateSprint

  // #region - deleteSprint
  *deleteSprintWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockSprints.findIndex((s) => s.id === id);
        if (index !== -1) {
          mockSprints.splice(index, 1);
        }
        yield put(actions.deleteSprintSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(sprintsApi.deleteSprint, payload.data.id);
        yield put(actions.deleteSprintSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete sprint';
      yield put(actions.deleteSprintFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteSprint

  // #region - startSprint
  *startSprintWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const sprintIndex = mockSprints.findIndex((s) => s.id === id);
        if (sprintIndex === -1) throw new Error('Sprint not found');

        const updatedSprint: Sprint = {
          ...mockSprints[sprintIndex],
          status: 'active',
          startDate: new Date().toISOString(),
        };
        mockSprints[sprintIndex] = updatedSprint;
        yield put(actions.startSprintSuccess({ data: updatedSprint } as any));
        payload.callback?.onSuccess?.(updatedSprint);
      } else {
        const response = yield call(sprintsApi.startSprint, payload.data.id);
        const transformed = transformSprint(response.data);
        yield put(actions.startSprintSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to start sprint';
      yield put(actions.startSprintFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - startSprint

  // #region - completeSprint
  *completeSprintWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const sprintIndex = mockSprints.findIndex((s) => s.id === id);
        if (sprintIndex === -1) throw new Error('Sprint not found');

        const updatedSprint: Sprint = {
          ...mockSprints[sprintIndex],
          status: 'closed',
          endDate: new Date().toISOString(),
        };
        mockSprints[sprintIndex] = updatedSprint;
        yield put(actions.completeSprintSuccess({ data: updatedSprint } as any));
        payload.callback?.onSuccess?.(updatedSprint);
      } else {
        const response = yield call(sprintsApi.completeSprint, payload.data.id);
        const transformed = transformSprint(response.data);
        yield put(actions.completeSprintSuccess({ data: transformed } as any));
        payload.callback?.onSuccess?.(transformed);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to complete sprint';
      yield put(actions.completeSprintFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - completeSprint
};

const sagaWatcher = [
  takeLatest(actions.getSprintsByBoardRequest.type, sagas.getSprintsByBoardWorker),
  takeLatest(actions.getSprintByIdRequest.type, sagas.getSprintByIdWorker),
  takeLatest(actions.createSprintRequest.type, sagas.createSprintWorker),
  takeLatest(actions.updateSprintRequest.type, sagas.updateSprintWorker),
  takeLatest(actions.deleteSprintRequest.type, sagas.deleteSprintWorker),
  takeLatest(actions.startSprintRequest.type, sagas.startSprintWorker),
  takeLatest(actions.completeSprintRequest.type, sagas.completeSprintWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}








