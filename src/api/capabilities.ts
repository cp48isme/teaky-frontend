import { apiRequest } from './client';
import type { Capability } from '../types/capability';

export async function listCapabilities(): Promise<Capability[]> {
  return apiRequest<Capability[]>('/capabilities');
}

export async function getOrgCapabilities(
  orgId: string,
): Promise<Capability[]> {
  return apiRequest<Capability[]>(`/organizations/${orgId}/capabilities`);
}

export async function replaceOrgCapabilities(
  orgId: string,
  capabilityIds: string[],
): Promise<Capability[]> {
  return apiRequest<Capability[]>(`/organizations/${orgId}/capabilities`, {
    method: 'PUT',
    body: JSON.stringify({ capability_ids: capabilityIds }),
  });
}

export async function getCapabilitySuggestions(
  equipmentIds: string[],
): Promise<Capability[]> {
  if (equipmentIds.length === 0) return [];
  return apiRequest<Capability[]>(
    `/equipment/capability-suggestions?equipment_ids=${equipmentIds.join(',')}`,
  );
}
