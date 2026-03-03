import { apiRequest } from './client';

export interface OrderFile {
  id: string;
  order_id: string;
  filename: string;
  file_url: string;
  file_size_bytes: number;
  mime_type: string;
  file_category: string;
  uploaded_by_id: string;
  created_at: string;
}

export async function listOrderFiles(orderId: string): Promise<OrderFile[]> {
  return apiRequest<OrderFile[]>(`/orders/${orderId}/files`);
}

export async function uploadOrderFile(orderId: string, file: File): Promise<OrderFile> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const response = await fetch(`/api/orders/${orderId}/files`, {
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
