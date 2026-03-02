import { apiRequest } from './client';
import type {
  MISSettings,
  TestConnectionResponse,
  QueueMappingsResponse,
  OrderSyncStatus,
  ManualPushResponse,
  MISSyncLogEntry,
} from '../types/mis';

export async function getMISSettings(): Promise<MISSettings> {
  return apiRequest<MISSettings>('/settings/mis');
}

export async function updateMISSettings(
  data: Partial<MISSettings>,
): Promise<MISSettings> {
  return apiRequest<MISSettings>('/settings/mis', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function testMISConnection(): Promise<TestConnectionResponse> {
  return apiRequest<TestConnectionResponse>('/settings/mis/test-connection', {
    method: 'POST',
  });
}

export async function getOrderSyncStatus(
  orderId: string,
): Promise<OrderSyncStatus> {
  return apiRequest<OrderSyncStatus>(`/mis/orders/${orderId}/sync-status`);
}

export async function manualPushOrder(
  orderId: string,
): Promise<ManualPushResponse> {
  return apiRequest<ManualPushResponse>(`/mis/orders/${orderId}/push`, {
    method: 'POST',
  });
}

export async function getSyncLog(): Promise<MISSyncLogEntry[]> {
  return apiRequest<MISSyncLogEntry[]>('/mis/sync-log');
}

export async function getQueueMappings(): Promise<QueueMappingsResponse> {
  return apiRequest<QueueMappingsResponse>('/mis/queue-mappings');
}

export async function updateQueueMappings(
  queueMapping: Record<string, string>,
): Promise<QueueMappingsResponse> {
  return apiRequest<QueueMappingsResponse>('/mis/queue-mappings', {
    method: 'PUT',
    body: JSON.stringify({ queue_mapping: queueMapping }),
  });
}
