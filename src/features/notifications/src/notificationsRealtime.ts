import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../../shared/constants/src';
import type { AppDispatch } from '../../../store';
import { actions } from './store/reducers';
import { normalizeNotificationFromApi } from './store/notificationTransform';

export function connectNotificationsSocket(
  token: string,
  dispatch: AppDispatch,
): Socket {
  const base = API_BASE_URL.replace(/\/$/, '');
  const socket = io(`${base}/notifications`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('notification:new', (raw: unknown) => {
    const normalized = normalizeNotificationFromApi(raw) as Record<
      string,
      unknown
    >;
    if (normalized?.id) {
      dispatch(actions.notificationReceived(normalized));
    }
  });

  socket.on('reconnect', () => {
    dispatch(
      actions.getNotificationsRequest({
        data: {},
        callback: {},
      } as any),
    );
  });

  return socket;
}
