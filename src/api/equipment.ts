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

export async function createCustomEquipment(data: {
  name: string;
  manufacturer?: string;
  model_number?: string;
  equipment_type: string;
  category?: string;
}): Promise<Equipment> {
  return apiRequest<Equipment>('/equipment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadOnboardingDocument(
  file: File,
): Promise<{ task_id: string; file_url: string; message: string }> {
  const formData = new FormData();
  formData.append('file', file);

  // Use raw fetch since apiRequest assumes JSON content-type
  const token = localStorage.getItem('access_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const res = await fetch(`${baseUrl}/onboarding/upload-document`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Upload failed');
  }
  return res.json();
}
