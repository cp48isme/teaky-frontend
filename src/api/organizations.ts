import { apiRequest } from './client';
import type { OrganizationMe, ProductionShell } from '../types/organization';

export async function getMyOrganization(): Promise<OrganizationMe> {
  return apiRequest<OrganizationMe>('/organizations/me');
}

export async function getProductionShell(): Promise<ProductionShell> {
  return apiRequest<ProductionShell>('/organizations/me/shell');
}
