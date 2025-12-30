import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import usersApi from './api';
import type { User } from './states';

/**
 * Users Feature Sagas
 */

const sagas = {
  // #region - getUsers
  *getUsersWorker({ payload }: any) {
    try {
      const response = yield call(usersApi.getUsers);
      yield put(actions.getUsersSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch users';
      yield put(actions.getUsersFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getUsers

  // #region - getUserById
  *getUserByIdWorker({ payload }: any) {
    try {
      const response = yield call(usersApi.getUserById, payload.data.id);
      yield put(actions.getUserByIdSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch user';
      yield put(actions.getUserByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getUserById
};

const sagaWatcher = [
  takeLatest(actions.getUsersRequest.type, sagas.getUsersWorker),
  takeLatest(actions.getUserByIdRequest.type, sagas.getUserByIdWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}








