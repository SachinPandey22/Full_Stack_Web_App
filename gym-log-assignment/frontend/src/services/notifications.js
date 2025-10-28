import { apiClient } from './api';

export async function getNotifications() {
  const res = await apiClient.get('/api/notifications/');
  return res.data; // [{id, message, is_read, created_at}, ...]
}

export async function markAllNotificationsRead() {
  const res = await apiClient.post('/api/notifications/mark-all-read/');
  return res.data;
}
