import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import notificationsApi from './api';
import { normalizeNotificationFromApi } from './notificationTransform';

/**
 * Notifications Feature Sagas
 */

const sagas = {
  // #region - getNotifications
  *getNotificationsWorker({ payload }: any) {
    try {
      const response = yield call(notificationsApi.getNotifications);
      const transformedNotifications = response.data.map((notification: unknown) =>
        normalizeNotificationFromApi(notification),
      );
      yield put(actions.getNotificationsSuccess({ data: transformedNotifications } as any));
      payload.callback?.onSuccess?.(transformedNotifications);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get notifications';
      yield put(actions.getNotificationsFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getNotifications

  // #region - markAsRead
  *markAsReadWorker({ payload }: any) {
    try {
      const response = yield call(notificationsApi.markAsRead, payload.data.id);
      yield put(actions.markAsReadSuccess({ data: { id: payload.data.id } } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to mark notification as read';
      yield put(actions.markAsReadFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - markAsRead

  // #region - markAllAsRead
  *markAllAsReadWorker({ payload }: any) {
    try {
      const response = yield call(notificationsApi.markAllAsRead);
      yield put(actions.markAllAsReadSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to mark all notifications as read';
      yield put(actions.markAllAsReadFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - markAllAsRead
};

function* notificationsSaga() {
  yield all([
    takeLatest(actions.getNotificationsRequest.type, sagas.getNotificationsWorker),
    takeLatest(actions.markAsReadRequest.type, sagas.markAsReadWorker),
    takeLatest(actions.markAllAsReadRequest.type, sagas.markAllAsReadWorker),
  ]);
}

export default notificationsSaga;

