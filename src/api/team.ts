import { apiRequest, setTokens } from './client';
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

export async function acceptInvitation(token: string): Promise<Invitation> {
  return apiRequest<Invitation>(`/team/invitations/${token}/accept`, {
    method: 'POST',
  });
}

export async function getInvitationPreview(token: string): Promise<InvitationPreview> {
  return apiRequest<InvitationPreview>(`/team/invitations/${token}`);
}

/** Set a password and take up the invitation; the returned session is scoped to
 *  the inviting organisation (S86). */
export async function registerFromInvitation(token: string, password: string): Promise<void> {
  const tokens = await apiRequest<{ access_token: string; refresh_token: string; token_type: string; expires_in: number }>(
    `/team/invitations/${token}/register`,
    { method: 'POST', body: JSON.stringify({ password }) },
  );
  setTokens(tokens);
}
