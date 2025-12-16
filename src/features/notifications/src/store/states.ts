/**
 * Notifications Feature State
 */

import type { Issue } from '../../issues/src/store/states';

export interface Notification {
  id: string;
  userId: string;
  issueId?: string;
  issue?: Issue;
  title: string;
  message?: string;
  type: string; // 'issue_assigned', 'comment_added', 'status_changed', etc.
  isRead: boolean;
  createdAt: string;
}

// Initial state
const initialState = {
  notifications: [] as Notification[],
  unreadCount: 0,
  getNotificationsLoading: false,
  markAsReadLoading: false,
  markAllAsReadLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type NotificationsState = typeof initialState;
export default initialState;
