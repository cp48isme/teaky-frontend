export interface MISSettings {
  mis_provider: string | null;
  mis_config: Record<string, unknown> | null;
}

export interface TestConnectionResponse {
  connected: boolean;
  details: Record<string, unknown> | null;
}

export interface DMConfig {
  account_url: string;
  api_key?: string | null;
  webhook_secret?: string | null;
  queue_mapping: Record<string, string>;
  auto_push_on_approval: boolean;
}

export interface QueueMappingsResponse {
  queue_mapping: Record<string, string>;
}

export interface MISSyncLogEntry {
  id: string;
  organization_id: string;
  entity_type: string;
  entity_id: string;
  external_id: string | null;
  action: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

export interface OrderSyncStatus {
  dm_order_id: string | null;
  last_sync_at: string | null;
  last_sync_status: string | null;
  error_message: string | null;
}

export interface ManualPushResponse {
  status: string;
  sync_log: MISSyncLogEntry | null;
}
