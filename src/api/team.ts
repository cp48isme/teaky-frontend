import { apiRequest } from './client';
import type {
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
