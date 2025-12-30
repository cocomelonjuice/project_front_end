import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import projectsApi from './api';
import type { Project } from './states';

/**
 * Projects Feature Sagas
 */

const sagas = {
  // #region - getProjects
  *getProjectsWorker({ payload }: any) {
    try {
      const response = yield call(projectsApi.getProjects);
      yield put(actions.getProjectsSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch projects';
      yield put(actions.getProjectsFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getProjects

  // #region - getProjectById
  *getProjectByIdWorker({ payload }: any) {
    try {
      const response = yield call(projectsApi.getProjectById, payload.data.id);
      yield put(actions.getProjectByIdSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch project';
      yield put(actions.getProjectByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getProjectById

  // #region - createProject
  *createProjectWorker({ payload }: any) {
    try {
      const response = yield call(projectsApi.createProject, payload.data);
      yield put(actions.createProjectSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create project';
      yield put(actions.createProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createProject

  // #region - updateProject
  *updateProjectWorker({ payload }: any) {
    try {
      // Extract id and exclude it from the data object (id is in URL, not body)
      const { id, ...updateData } = payload.data;
      const response = yield call(projectsApi.updateProject, id, updateData);
      yield put(actions.updateProjectSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update project';
      yield put(actions.updateProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateProject

  // #region - deleteProject
  *deleteProjectWorker({ payload }: any) {
    try {
      yield call(projectsApi.deleteProject, payload.data.id);
      yield put(actions.deleteProjectSuccess({ data: { id: payload.data.id } } as any));
      payload.callback?.onSuccess?.(payload.data.id);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete project';
      yield put(actions.deleteProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteProject
};

const sagaWatcher = [
  takeLatest(actions.getProjectsRequest.type, sagas.getProjectsWorker),
  takeLatest(actions.getProjectByIdRequest.type, sagas.getProjectByIdWorker),
  takeLatest(actions.createProjectRequest.type, sagas.createProjectWorker),
  takeLatest(actions.updateProjectRequest.type, sagas.updateProjectWorker),
  takeLatest(actions.deleteProjectRequest.type, sagas.deleteProjectWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}

