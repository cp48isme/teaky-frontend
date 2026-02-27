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
