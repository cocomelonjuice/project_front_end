import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import boardsApi from './api';

/**
 * Boards Feature Sagas
 */

const sagas = {
  // #region - getBoardsByProject
  *getBoardsByProjectWorker({ payload }: any) {
    try {
      const response = yield call(boardsApi.getBoardsByProject, payload.data.projectId);
      yield put(actions.getBoardsByProjectSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch boards';
      yield put(actions.getBoardsByProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getBoardsByProject

  // #region - getBoardById
  *getBoardByIdWorker({ payload }: any) {
    try {
      const response = yield call(boardsApi.getBoardById, payload.data.id);
      yield put(actions.getBoardByIdSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch board';
      yield put(actions.getBoardByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getBoardById

  // #region - createBoard
  *createBoardWorker({ payload }: any) {
    try {
      const { projectId, ...boardData } = payload.data;
      const response = yield call(boardsApi.createBoard, projectId, boardData);
      yield put(actions.createBoardSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create board';
      yield put(actions.createBoardFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createBoard

  // #region - updateBoard
  *updateBoardWorker({ payload }: any) {
    try {
      // Extract id and exclude it from the data object (id is in URL, not body)
      const { id, ...updateData } = payload.data;
      const response = yield call(boardsApi.updateBoard, id, updateData);
      yield put(actions.updateBoardSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update board';
      yield put(actions.updateBoardFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateBoard

  // #region - deleteBoard
  *deleteBoardWorker({ payload }: any) {
    try {
      yield call(boardsApi.deleteBoard, payload.data.id);
      yield put(actions.deleteBoardSuccess({ data: { id: payload.data.id } } as any));
      payload.callback?.onSuccess?.(payload.data.id);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete board';
      yield put(actions.deleteBoardFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteBoard
};

const sagaWatcher = [
  takeLatest(actions.getBoardsByProjectRequest.type, sagas.getBoardsByProjectWorker),
  takeLatest(actions.getBoardByIdRequest.type, sagas.getBoardByIdWorker),
  takeLatest(actions.createBoardRequest.type, sagas.createBoardWorker),
  takeLatest(actions.updateBoardRequest.type, sagas.updateBoardWorker),
  takeLatest(actions.deleteBoardRequest.type, sagas.deleteBoardWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}




