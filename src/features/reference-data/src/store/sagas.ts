import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import referenceDataApi from './api';

/**
 * Reference Data Feature Sagas
 */

const sagas = {
  // #region - getIssueTypes
  *getIssueTypesWorker({ payload }: any) {
    try {
      const response = yield call(referenceDataApi.getIssueTypes);
      yield put(actions.getIssueTypesSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch issue types';
      yield put(actions.getIssueTypesFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getIssueTypes

  // #region - getPriorities
  *getPrioritiesWorker({ payload }: any) {
    try {
      const response = yield call(referenceDataApi.getPriorities);
      yield put(actions.getPrioritiesSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch priorities';
      yield put(actions.getPrioritiesFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getPriorities

  // #region - getStatuses
  *getStatusesWorker({ payload }: any) {
    try {
      const response = yield call(referenceDataApi.getStatuses);
      yield put(actions.getStatusesSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch statuses';
      yield put(actions.getStatusesFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getStatuses
};

const sagaWatcher = [
  takeLatest(actions.getIssueTypesRequest.type, sagas.getIssueTypesWorker),
  takeLatest(actions.getPrioritiesRequest.type, sagas.getPrioritiesWorker),
  takeLatest(actions.getStatusesRequest.type, sagas.getStatusesWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}







