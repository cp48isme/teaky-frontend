export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  resource_type: string | null;
  resource_id: string | null;
  context_snapshot: Record<string, unknown> | null;
  read_at: string | null;
  email_sent_at: string | null;
  created_at: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationPreference {
  event_type: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreference[];
}

export interface UpdateNotificationPreferencesRequest {
  preferences: NotificationPreference[];
}
