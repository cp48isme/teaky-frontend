import { apiRequest } from './client';
import type { Notification, UnreadCountResponse } from '../types/notification';

export async function listNotifications(
  unreadOnly = false,
  limit = 50,
  offset = 0,
): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (unreadOnly) params.set('unread_only', 'true');
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return apiRequest<Notification[]>(`/notifications?${params.toString()}`);
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  return apiRequest<UnreadCountResponse>('/notifications/unread-count');
}

export async function markRead(notificationIds: string[]): Promise<void> {
  return apiRequest<void>('/notifications/mark-read', {
    method: 'POST',
    body: JSON.stringify({ notification_ids: notificationIds }),
  });
}

export async function markAllRead(): Promise<void> {
  return apiRequest<void>('/notifications/mark-all-read', {
    method: 'POST',
  });
}
