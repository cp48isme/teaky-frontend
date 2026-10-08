import { apiRequest } from './client';
import type { OrganizationMe } from '../types/organization';

export async function getMyOrganization(): Promise<OrganizationMe> {
  return apiRequest<OrganizationMe>('/organizations/me');
}
