import { rememberSignedInDisplayName } from '../lib/portalSession';
import { apiRequest, setSession } from './client';
import type { SessionResponse } from '../types/auth';
import type {
  InvitationPreview,
  TeamMember,
  Invitation,
  InviteTeamMemberRequest,
  UpdateTeamMemberRequest,
} from '../types/team';

export async function listMembers(): Promise<TeamMember[]> {
  return apiRequest<TeamMember[]>('/team/members');
}

export async function getMember(userId: string): Promise<TeamMember> {
  return apiRequest<TeamMember>(`/team/members/${userId}`);
}

export async function inviteMember(
  request: InviteTeamMemberRequest,
): Promise<Invitation> {
  return apiRequest<Invitation>('/team/invite', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function updateMember(
  userId: string,
  request: UpdateTeamMemberRequest,
): Promise<TeamMember> {
  return apiRequest<TeamMember>(`/team/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}

export async function removeMember(userId: string): Promise<void> {
  return apiRequest<void>(`/team/members/${userId}`, {
    method: 'DELETE',
  });
}

export async function listInvitations(): Promise<Invitation[]> {
  return apiRequest<Invitation[]>('/team/invitations');
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  return apiRequest<void>(`/team/invitations/${invitationId}`, {
    method: 'DELETE',
  });
}

/** Clear an invitation past its expiry in one click (walk C6, 26 Nov 2026): no
 *  proposal — proposals are for acts against a live person. The server sets
 *  revoked_at and keeps an audit row; a live invitation is refused with 409. */
export async function clearExpiredInvitation(invitationId: string): Promise<Invitation> {
  return apiRequest<Invitation>(`/team/invitations/${invitationId}/clear`, {
    method: 'POST',
  });
}

// The token goes in the request body on all three public calls, never in the
// path or query: a path token is written to every access log on the way in
// (bead nt7z, 29 Oct 2026).
export async function acceptInvitation(token: string): Promise<Invitation> {
  return apiRequest<Invitation>('/team/invitations/accept', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function getInvitationPreview(token: string): Promise<InvitationPreview> {
  return apiRequest<InvitationPreview>('/team/invitations/preview', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

/** Set a password and take up the invitation; the returned session is scoped to
 *  the inviting organisation (S86). */
export async function registerFromInvitation(
  token: string,
  password: string,
  displayName?: string,
): Promise<void> {
  const tokens = await apiRequest<SessionResponse>(
    '/team/invitations/register',
    { method: 'POST', body: JSON.stringify({ token, password, display_name: displayName || undefined }) },
  );
  setSession(tokens);
  // The name the person gave is what the account menu shows (dispatch 19 Nov 2026).
  rememberSignedInDisplayName(displayName ?? '');
}
