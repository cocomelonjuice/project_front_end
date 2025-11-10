import { all, put, takeLatest } from 'redux-saga/effects';
// import api from './api'; // Uncomment when you have API functions
import { actions } from './reducers';

/**
 * Example Feature Sagas
 * Similar to portal feature sagas pattern
 */

const sagas = {
  // #region - getExampleData
  *getExampleDataWorker({ payload }: any) {
    try {
      // Example API call
      // const response = yield call(api.getExampleData, payload.data);
      
      // For demo, simulate API call
      const mockResponse = { data: { id: payload.data?.id, name: 'Example Data' } };
      
      yield put(actions.getExampleDataSuccess({ data: mockResponse.data } as any));
      payload.callback?.onSuccess?.(mockResponse.data);
    } catch (error: any) {
      yield put(actions.getExampleDataFailure(error?.data?.error?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getExampleData
};

const sagaWatcher = [
  takeLatest(actions.getExampleDataRequest, sagas.getExampleDataWorker),
  // Add more watchers here
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}

