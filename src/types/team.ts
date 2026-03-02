export interface PortalAssignment {
  portal_id: string;
  portal_name: string;
  assigned_at: string;
}

export interface TeamMember {
  user_id: string;
  email: string;
  roles: string[];
  portal_assignments: PortalAssignment[];
  reports_to: string | null;
  assigned_at: string;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: string;
  portal_ids?: string[];
}

export interface UpdateTeamMemberRequest {
  role?: string;
  portal_ids?: string[];
  reports_to?: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  invited_email: string;
  invited_by: string;
  role: string;
  portal_ids: string[] | null;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}
