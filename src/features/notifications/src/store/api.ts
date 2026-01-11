/**
 * Notifications Feature API
 */

import axiosInstance from '../../../../shared/api/src/axios';
import type { Notification } from './states';

export const notificationsApi = {
  // Get all notifications for current user
  getNotifications: () =>
    axiosInstance.get<Notification[]>('/notifications'),

  // Get notification by ID
  getNotification: (id: string) =>
    axiosInstance.get<Notification>(`/notifications/${id}`),

  // Mark notification as read
  markAsRead: (id: string) =>
    axiosInstance.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () =>
    axiosInstance.put('/notifications/read-all'),
};

export default notificationsApi;

