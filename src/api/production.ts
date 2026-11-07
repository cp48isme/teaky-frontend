import { apiRequest } from './client';
import type {
  BatchSummary,
  ProductionSettings,
  PushOutPreview,
  PushOutResult,
  SpecAssertion,
  SpecHistoryEntry,
  SpecLibraryRow,
  SpecSuggestion,
  TaylorPoolLine,
} from '../types/production';

export async function listBatches(): Promise<BatchSummary[]> {
  return apiRequest<BatchSummary[]>('/release-units');
}

export async function getPushOutPreview(unitId: string): Promise<PushOutPreview> {
  return apiRequest<PushOutPreview>(`/release-units/${unitId}/push-preview`);
}

export async function pushOut(unitId: string): Promise<PushOutResult> {
  return apiRequest<PushOutResult>(`/release-units/${unitId}/push-out`, { method: 'POST' });
}

export async function listTaylorPool(): Promise<TaylorPoolLine[]> {
  return apiRequest<TaylorPoolLine[]>('/intake/taylor/pool');
}

export async function listSpecLibrary(): Promise<SpecLibraryRow[]> {
  return apiRequest<SpecLibraryRow[]>('/spec-library');
}

export async function getSpecHistory(productKey: string): Promise<SpecHistoryEntry[]> {
  return apiRequest<SpecHistoryEntry[]>(`/spec-library/${encodeURIComponent(productKey)}/history`);
}

export async function getSpecSuggestion(productKey: string, context: { portalId?: string | null; description?: string } = {}): Promise<SpecSuggestion> {
  const params = new URLSearchParams();
  if (context.portalId) params.set('portal_id', context.portalId);
  if (context.description) params.set('description', context.description);
  const query = params.toString();
  return apiRequest<SpecSuggestion>(`/spec-library/${encodeURIComponent(productKey)}/suggest${query ? `?${query}` : ''}`);
}

export async function correctStock(productKey: string, value: string, note: string): Promise<SpecAssertion> {
  return apiRequest<SpecAssertion>(`/spec-library/${encodeURIComponent(productKey)}/assert`, {
    method: 'POST',
    body: JSON.stringify({ value, note }),
  });
}

export async function markNotBatched(productKey: string, note: string): Promise<SpecAssertion> {
  return apiRequest<SpecAssertion>(`/spec-library/${encodeURIComponent(productKey)}/not-batched`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export async function getProductionSettings(): Promise<ProductionSettings> {
  return apiRequest<ProductionSettings>('/organizations/me/production-settings');
}

export async function updateProductionSettings(settings: ProductionSettings): Promise<ProductionSettings> {
  return apiRequest<ProductionSettings>('/organizations/me/production-settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

/** "fetch now" on Held: the manual pull (the switch stays off). */
export async function pullTaylorNow(): Promise<unknown> {
  return apiRequest<unknown>('/intake/taylor/pull-now', { method: 'POST' });
}
