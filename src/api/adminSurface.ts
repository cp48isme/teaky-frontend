import { apiRequest } from './client';
import type {
  AdminMember,
  AdminProposal,
  AdminSettings,
  ProposeAdminActionRequest,
} from '../types/adminSurface';
import type { ActionProposalStatus } from '../types/proposals';

export async function listAdminMembers(): Promise<AdminMember[]> {
  return apiRequest<AdminMember[]>('/admin/members');
}

export async function getAdminSettings(): Promise<AdminSettings> {
  return apiRequest<AdminSettings>('/admin/settings');
}

export async function updateAdminSettings(body: AdminSettings): Promise<AdminSettings> {
  return apiRequest<AdminSettings>('/admin/settings', { method: 'PUT', body: JSON.stringify(body) });
}

export async function listAdminProposals(filter: { status?: ActionProposalStatus; targetId?: string } = {}): Promise<AdminProposal[]> {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.targetId) params.set('target_id', filter.targetId);
  const query = params.toString();
  return apiRequest<AdminProposal[]>(`/admin/proposals${query ? `?${query}` : ''}`);
}

export async function proposeAdminAction(body: ProposeAdminActionRequest): Promise<AdminProposal> {
  return apiRequest<AdminProposal>('/admin/proposals', { method: 'POST', body: JSON.stringify(body) });
}

export async function approveAdminProposal(proposalId: string, note = ''): Promise<AdminProposal> {
  return apiRequest<AdminProposal>(`/admin/proposals/${proposalId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export async function declineAdminProposal(proposalId: string, note = ''): Promise<AdminProposal> {
  return apiRequest<AdminProposal>(`/admin/proposals/${proposalId}/decline`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}
