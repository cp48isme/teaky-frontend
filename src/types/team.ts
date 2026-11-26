export interface PortalAssignment {
  portal_id: string;
  portal_name: string;
  assigned_at: string;
}

export interface TeamMember {
  user_id: string;
  email: string;
  display_name: string | null;
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

/** The Team page's direct edit (ruled 26 Nov 2026, evening): display name,
 *  portals, reports_to. A role change is a proposal on Settings → Admin, never
 *  a field here — the server refuses one with 409. */
export interface UpdateTeamMemberRequest {
  display_name?: string;
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
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Public preview of an invitation, by its token (S86). */
export interface InvitationPreview {
  invited_email: string;
  organization_name: string;
  role: string;
  portal_slug: string | null;
  portal_name: string | null;
  state: 'valid' | 'expired' | 'accepted' | 'revoked';
  account_exists: boolean;
}
