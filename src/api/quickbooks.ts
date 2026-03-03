import { apiRequest } from './client';
import type {
  QuickBooksStatus,
  QuickBooksConnectResponse,
  QuickBooksSyncResponse,
} from '../types/quickbooks';

export async function getQuickBooksStatus(): Promise<QuickBooksStatus> {
  return apiRequest<QuickBooksStatus>('/integrations/quickbooks/status');
}

export async function getQuickBooksConnectUrl(): Promise<QuickBooksConnectResponse> {
  return apiRequest<QuickBooksConnectResponse>('/integrations/quickbooks/connect');
}

export async function syncOrderToQuickBooks(
  orderId: string,
): Promise<QuickBooksSyncResponse> {
  return apiRequest<QuickBooksSyncResponse>(
    `/integrations/quickbooks/sync/${orderId}`,
    { method: 'POST' },
  );
}

export async function recordQuickBooksPayment(
  orderId: string,
): Promise<QuickBooksSyncResponse> {
  return apiRequest<QuickBooksSyncResponse>(
    `/integrations/quickbooks/sync/${orderId}/payment`,
    { method: 'POST' },
  );
}
