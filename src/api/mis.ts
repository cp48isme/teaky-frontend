import { apiRequest } from './client';
import type { MISSettings, TestConnectionResponse } from '../types/mis';

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
