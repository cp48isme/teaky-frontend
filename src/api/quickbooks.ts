import { apiRequest } from './client';
import type {
  QuickBooksStatus,
  QuickBooksConnectResponse,
} from '../types/quickbooks';

export async function getQuickBooksStatus(): Promise<QuickBooksStatus> {
  return apiRequest<QuickBooksStatus>('/integrations/quickbooks/connection');
}

export async function getQuickBooksConnectUrl(): Promise<QuickBooksConnectResponse> {
  return apiRequest<QuickBooksConnectResponse>('/integrations/quickbooks/connect');
}

// The invoice sync and payment calls were removed 2026-10-20 by ruling:
// Teaky never creates, sends or pays a QuickBooks Invoice.
