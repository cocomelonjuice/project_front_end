import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import searchApi from './api';

/**
 * Search Feature Sagas
 */

const sagas = {
  // #region - search
  *searchWorker({ payload }: any) {
    try {
      const { query, type, limit, filters, callback } = payload;
      const hasQuery = typeof query === 'string' && query.trim().length > 0;
      const hasFilters =
        !!filters &&
        Object.values(filters).some(
          (value) => Array.isArray(value) && value.length > 0,
        );

      if (!hasQuery && !hasFilters) {
        yield put(actions.searchSuccess({ data: { projects: [], issues: [], users: [], total: 0 } }));
        callback?.onSuccess?.({ projects: [], issues: [], users: [], total: 0 });
        return;
      }

      const response = yield call(
        searchApi.search,
        hasQuery ? query.trim() : '',
        type,
        limit,
        filters,
      );
      yield put(actions.searchSuccess({ data: response }));
      callback?.onSuccess?.(response);
    } catch (error: any) {
      // Don't show technical error messages to users
      const errorMessage = 'Search failed. Please try again.';
      yield put(actions.searchFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - search
};

const sagaWatcher = [
  takeLatest(actions.searchRequest.type, sagas.searchWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}

