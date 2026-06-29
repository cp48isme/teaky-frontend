export interface DMConfig {
  account_url: string;
  api_key?: string | null;
  webhook_secret?: string | null;
  queue_mapping: Record<string, string>;
  auto_push_on_approval: boolean;
}

export interface PrintavoConfig {
  api_token: string;
  shop_email: string;
  auto_push_on_approval: boolean;
}

export interface ShopVOXConfig {
  api_url: string;
  api_key: string;
  app_id: string;
  auto_push_on_approval: boolean;
}

export interface GenericCSVConfig {
  notification_email: string;
  csv_format: string;
}

export interface GenericWebhookConfig {
  webhook_url: string;
  webhook_secret?: string | null;
}

export type MISConfig =
  | DMConfig
  | PrintavoConfig
  | ShopVOXConfig
  | GenericCSVConfig
  | GenericWebhookConfig;

export function isDMConfig(c: MISConfig): c is DMConfig {
  return 'account_url' in c;
}

export function isPrintavoConfig(c: MISConfig): c is PrintavoConfig {
  return 'api_token' in c;
}

export function isShopVOXConfig(c: MISConfig): c is ShopVOXConfig {
  return 'api_url' in c;
}

export function isGenericCSVConfig(c: MISConfig): c is GenericCSVConfig {
  return 'notification_email' in c;
}

export function isGenericWebhookConfig(c: MISConfig): c is GenericWebhookConfig {
  return 'webhook_url' in c;
}

export interface MISSettings {
  mis_provider: string | null;
  mis_config: MISConfig | null;
}

export interface TestConnectionResponse {
  connected: boolean;
  details: Record<string, unknown> | null;
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
