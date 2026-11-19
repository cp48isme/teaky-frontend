import { apiRequest } from './client';
import type { OrganizationMe, ProductionShell } from '../types/organization';

export async function getMyOrganization(): Promise<OrganizationMe> {
  return apiRequest<OrganizationMe>('/organizations/me');
}

export async function getProductionShell(): Promise<ProductionShell> {
  return apiRequest<ProductionShell>('/organizations/me/shell');
}

/** PATCH /organizations/me (t06, 19 Nov 2026): the organisation's display
 * name, settings:manage (the printer_admin). Until this route the name was
 * SQL. */
export async function updateMyOrganization(body: { name: string }): Promise<OrganizationMe> {
  return apiRequest<OrganizationMe>('/organizations/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
