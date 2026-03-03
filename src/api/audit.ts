import { apiRequest } from './client';
import type { AuditLogPage, AuditSearchParams } from '../types/audit';

function buildQuery(params: AuditSearchParams): string {
  const searchParams = new URLSearchParams();
  if (params.action) searchParams.set('action', params.action);
  if (params.user_id) searchParams.set('user_id', params.user_id);
  if (params.resource_type) searchParams.set('resource_type', params.resource_type);
  if (params.resource_id) searchParams.set('resource_id', params.resource_id);
  if (params.start_date) searchParams.set('start_date', params.start_date);
  if (params.end_date) searchParams.set('end_date', params.end_date);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function searchAuditTrail(params: AuditSearchParams = {}): Promise<AuditLogPage> {
  return apiRequest<AuditLogPage>(`/audit-trail${buildQuery(params)}`);
}

export function getExportUrl(format: 'csv' | 'json', params: AuditSearchParams = {}): string {
  const searchParams = new URLSearchParams();
  searchParams.set('format', format);
  if (params.action) searchParams.set('action', params.action);
  if (params.user_id) searchParams.set('user_id', params.user_id);
  if (params.resource_type) searchParams.set('resource_type', params.resource_type);
  if (params.resource_id) searchParams.set('resource_id', params.resource_id);
  if (params.start_date) searchParams.set('start_date', params.start_date);
  if (params.end_date) searchParams.set('end_date', params.end_date);
  return `/api/audit-trail/export?${searchParams.toString()}`;
}
