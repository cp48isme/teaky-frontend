import { apiRequest } from './client';
import type { OrderFile } from '../types/order';
import { getAccessToken } from './client';

export type { OrderFile };

export async function listOrderFiles(orderId: string): Promise<OrderFile[]> {
  return apiRequest<OrderFile[]>(`/orders/${orderId}/files`);
}

export async function uploadOrderFile(orderId: string, file: File): Promise<OrderFile> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAccessToken();
  const response = await fetch(`/api/orders/${orderId}/files`, {
    credentials: 'include',
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || 'Failed to upload file');
  }

  return response.json();
}

export async function deleteOrderFile(orderId: string, fileId: string): Promise<void> {
  return apiRequest<void>(`/orders/${orderId}/files/${fileId}`, {
    method: 'DELETE',
  });
}
