import { apiRequest } from './client';
import type { Equipment } from '../types/equipment';
import type {
  OrganizationEquipment,
  AddOrganizationEquipmentRequest,
} from '../types/equipment';

export async function searchEquipment(params: {
  query?: string;
  equipment_type?: string;
  manufacturer?: string;
}): Promise<Equipment[]> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.equipment_type)
    searchParams.set('equipment_type', params.equipment_type);
  if (params.manufacturer)
    searchParams.set('manufacturer', params.manufacturer);

  const qs = searchParams.toString();
  return apiRequest<Equipment[]>(`/equipment${qs ? `?${qs}` : ''}`);
}

export async function getOrgEquipment(
  orgId: string,
): Promise<OrganizationEquipment[]> {
  return apiRequest<OrganizationEquipment[]>(
    `/organizations/${orgId}/equipment`,
  );
}

export async function addEquipmentToOrg(
  orgId: string,
  data: AddOrganizationEquipmentRequest,
): Promise<OrganizationEquipment> {
  return apiRequest<OrganizationEquipment>(
    `/organizations/${orgId}/equipment`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function removeEquipmentFromOrg(
  orgId: string,
  equipmentId: string,
): Promise<void> {
  return apiRequest<void>(
    `/organizations/${orgId}/equipment/${equipmentId}`,
    { method: 'DELETE' },
  );
}
