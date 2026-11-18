import { apiRequest } from './client';
import type { ActionProposal, ActionProposalStatus, ProposeActionRequest } from '../types/proposals';

/** Action proposals (backend #259, rev 42): every route is `production:rules`
 * on the API — the shadow_reader is refused the list as well as the actions,
 * so the screens fetch nothing here for it. */

export async function listProposals(filter: { status?: ActionProposalStatus; targetId?: string } = {}): Promise<ActionProposal[]> {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.targetId) params.set('target_id', filter.targetId);
  const query = params.toString();
  return apiRequest<ActionProposal[]>(`/production/proposals${query ? `?${query}` : ''}`);
}

export async function proposeAction(body: ProposeActionRequest): Promise<ActionProposal> {
  return apiRequest<ActionProposal>('/production/proposals', { method: 'POST', body: JSON.stringify(body) });
}

export async function approveProposal(proposalId: string, note = ''): Promise<ActionProposal> {
  return apiRequest<ActionProposal>(`/production/proposals/${proposalId}/approve`, { method: 'POST', body: JSON.stringify({ note }) });
}

/** Decline — or, when the caller is the proposer under the shop's
 * require_second_approver switch, a withdrawal (the server answers status
 * `withdrawn`); the same route either way. */
export async function declineProposal(proposalId: string, note = ''): Promise<ActionProposal> {
  return apiRequest<ActionProposal>(`/production/proposals/${proposalId}/decline`, { method: 'POST', body: JSON.stringify({ note }) });
}
