import { apiRequest } from './client';
import type { BatchSummary, PushOutPreview, PushOutResult, TaylorPoolLine } from '../types/production';

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

/** Andrew, 6 Nov 2026: a batch at 12 or fewer slots used becomes a half
 * batch (capacity 12, 125 sheets); the push still goes through the
 * confirmation, whose preview this returns. */
export async function markHalfBatch(unitId: string): Promise<PushOutPreview> {
  return apiRequest<PushOutPreview>(`/release-units/${unitId}/half-batch`, { method: 'POST' });
}
