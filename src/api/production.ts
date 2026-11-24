import { apiRequest, getAccessToken } from './client';
import type { BatchSummary, MarkDoneResult, ProductionSettings, PushOutPreview, PushOutResult, ScanResult, SpecAssertion, SpecHistoryEntry, SpecLibraryRow, SpecSuggestion, StationHoldResult, StationScan, StationView, TagRules, TaylorPoolLine,
  MarkPickedResult,
  StockedGoodsUnit,
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

/** Andrew, 6 Nov 2026: a batch at 12 or fewer slots used becomes a half
 * batch (capacity 12, 125 sheets); the push still goes through the
 * confirmation, whose preview this returns. */
export async function markHalfBatch(unitId: string): Promise<PushOutPreview> {
  return apiRequest<PushOutPreview>(`/release-units/${unitId}/half-batch`, { method: 'POST' });
}

/** Mark done (D4; on the card since the walk of 20 Nov 2026): confirm false answers with the plan and writes nothing; confirm true skips the remaining route steps and marks the batch done. */
export async function markBatchDone(unitId: string, reason: string, confirm: boolean): Promise<MarkDoneResult> {
  return apiRequest<MarkDoneResult>(`/release-units/${unitId}/mark-done`, { method: 'POST', body: JSON.stringify({ reason, confirm }) });
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

/** Day 5, Part B — the station view. The scanned text is the unit id (the
 * job ticket's barcode is Code 128 of the unit id only). */
export async function getStationView(unitId: string): Promise<StationView> {
  return apiRequest<StationView>(`/release-units/${encodeURIComponent(unitId)}/station`);
}

export async function listStationScans(station: string): Promise<StationScan[]> {
  const q = station ? `?station=${encodeURIComponent(station)}` : '';
  return apiRequest<StationScan[]>(`/production/floor/scans${q}`);
}

export async function scanArrived(unitId: string, position: number, scannedBy: string, station: string): Promise<ScanResult> {
  return apiRequest<ScanResult>(`/release-units/${unitId}/steps/${position}/arrived`, {
    method: 'POST',
    body: JSON.stringify({ scanned_by: scannedBy, station }),
  });
}

export async function scanDone(unitId: string, position: number, scannedBy: string, station: string): Promise<ScanResult> {
  return apiRequest<ScanResult>(`/release-units/${unitId}/steps/${position}/done`, {
    method: 'POST',
    body: JSON.stringify({ scanned_by: scannedBy, station }),
  });
}

export async function holdFromStation(unitId: string, position: number, scannedBy: string, station: string, note: string): Promise<StationHoldResult> {
  return apiRequest<StationHoldResult>(`/release-units/${unitId}/steps/${position}/hold`, {
    method: 'POST',
    body: JSON.stringify({ scanned_by: scannedBy, station, note }),
  });
}

/** The customer → tags rules (t08, 19 Nov 2026), read and written whole under production settings. */
export async function getTagRules(): Promise<TagRules> {
  return apiRequest<TagRules>('/organizations/me/tag-rules');
}

export async function updateTagRules(rules: TagRules): Promise<TagRules> {
  return apiRequest<TagRules>('/organizations/me/tag-rules', { method: 'PUT', body: JSON.stringify(rules) });
}

/** The shop's press-run configuration (staff, production:rules); the stock rulings screen reads the Docket item-code keys as the stock list. */
export async function getPressRunConfig(): Promise<{ docket_item_codes?: Record<string, string> }> {
  return apiRequest<{ docket_item_codes?: Record<string, string> }>('/organizations/me/press-run-config');
}

/** Stocked goods (dispatch 23 Nov 2026, item 1). */
export async function listStockedGoodsUnits(): Promise<StockedGoodsUnit[]> {
  return apiRequest<StockedGoodsUnit[]>('/stocked-goods/units');
}

export async function markPicked(unitId: string, confirm: boolean): Promise<MarkPickedResult> {
  return apiRequest<MarkPickedResult>(`/stocked-goods/units/${unitId}/mark-picked`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirm }),
  });
}

/** The unit's shipping row as the ALLORDER CSV: fetched with the session's
 * token (a plain link would carry none) and handed to the browser as a file. */
export async function downloadShippingCsv(unitId: string, filename: string): Promise<void> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`/api/stocked-goods/units/${unitId}/shipping-csv`, { headers, credentials: 'include' });
  if (!response.ok) throw new Error(`The shipping row could not be fetched (${response.status})`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

