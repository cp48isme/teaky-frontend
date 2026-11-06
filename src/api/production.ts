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
