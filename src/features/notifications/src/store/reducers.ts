import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type NotificationsState } from './states';

export const MODULE_NAME = 'notifications';
export const useSelectorNotifications = getHookModuleSelector<NotificationsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getNotifications
    getNotificationsRequest(state, _action: any) {
      state.getNotificationsLoading = true;
      state.errors = null;
    },
    getNotificationsSuccess(state, { payload }: any) {
      state.getNotificationsLoading = false;
      state.notifications = payload.data || [];
      // Calculate unread count
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    getNotificationsFailure(state, { type, payload }: any) {
      state.getNotificationsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getNotifications

    // #region - markAsRead
    markAsReadRequest(state, _action: any) {
      state.markAsReadLoading = true;
      state.errors = null;
    },
    markAsReadSuccess(state, { payload }: any) {
      state.markAsReadLoading = false;
      // Update notification in state
      const notificationId = payload.data?.id || payload.id;
      if (notificationId) {
        state.notifications = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        // Recalculate unread count
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      }
    },
    markAsReadFailure(state, { type, payload }: any) {
      state.markAsReadLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - markAsRead

    // #region - markAllAsRead
    markAllAsReadRequest(state, _action: any) {
      state.markAllAsReadLoading = true;
      state.errors = null;
    },
    markAllAsReadSuccess(state, _payload: any) {
      state.markAllAsReadLoading = false;
      // Mark all notifications as read
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    markAllAsReadFailure(state, { type, payload }: any) {
      state.markAllAsReadLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - markAllAsRead

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - realtime (Socket.IO)
    notificationReceived(state, { payload }: any) {
      const n = payload;
      if (!n?.id) return;
      if (state.notifications.some((x) => x.id === n.id)) return;
      state.notifications = [n, ...state.notifications];
      state.unreadCount = state.notifications.filter((x) => !x.isRead).length;
    },
    // #endregion - realtime (Socket.IO)
  },
});

export { actions };
export default reducer;

