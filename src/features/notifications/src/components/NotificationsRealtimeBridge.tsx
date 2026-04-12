import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { Socket } from 'socket.io-client';
import type { AppDispatch } from '../../../../store';
import { useSelectorAuth } from '../../../auth/src/store';
import { notificationsActions } from '../store';
import { connectNotificationsSocket } from '../notificationsRealtime';

export function NotificationsRealtimeBridge() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelectorAuth((s) => s.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const t =
      token ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
    if (!t) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    dispatch(
      notificationsActions.getNotificationsRequest({
        data: {},
        callback: {},
      } as any),
    );

    socketRef.current?.disconnect();
    const socket = connectNotificationsSocket(t, dispatch);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, token]);

  return null;
}
