/** The shop admin surface (t03, ruled 19 Nov 2026): the admin family of the
 * proposal ledger, the members list with session facts, the two switches.
 * Mirrors models/schemas/admin_surface.py. */

import type { ActionProposalStatus } from './proposals';
import type { TeamMember } from './team';

export type AdminProposalKind =
  | 'deactivate_member'
  | 'reactivate_member'
  | 'remove_member'
  | 'change_role'
  | 'resend_invitation'
  | 'revoke_invitation';

export type AdminProposalTarget = 'member' | 'invitation';

export interface AdminMember extends TeamMember {
  is_active: boolean;
  last_sign_in_at: string | null;
  open_sessions: number;
}

export interface AdminMemberFacts {
  user_id: string;
  email: string;
  display_name: string | null;
  roles: string[];
  is_active: boolean;
  last_sign_in_at: string | null;
  open_sessions: number;
}

export interface AdminInvitationFacts {
  invitation_id: string;
  invited_email: string;
  role: string;
  portal_ids: string[];
  created_at: string;
  expires_at: string;
  state: 'pending' | 'expired' | 'accepted' | 'revoked';
}

export interface AdminProposalFacts {
  captured_at: string;
  target_kind: AdminProposalTarget;
  target_id: string;
  member: AdminMemberFacts | null;
  invitation: AdminInvitationFacts | null;
  new_role: string | null;
}

export interface AdminActionResult {
  kind: AdminProposalKind;
  target_id: string;
  applied_at: string;
  sessions_revoked: number;
  roles_removed: number;
  role_before: string[];
  role_after: string[];
  invitation_id: string | null;
}

export interface AdminProposal {
  id: string;
  organization_id: string;
  kind: AdminProposalKind;
  target_kind: AdminProposalTarget;
  target_id: string;
  reason: string;
  note: string;
  new_role: string | null;
  facts: AdminProposalFacts;
  status: ActionProposalStatus;
  proposed_by: string | null;
  proposed_at: string;
  decided_by: string | null;
  decided_at: string | null;
  decision_note: string;
  result: AdminActionResult | null;
  failure: string;
}

export interface ProposeAdminActionRequest {
  kind: AdminProposalKind;
  target_kind: AdminProposalTarget;
  target_id: string;
  reason: string;
  new_role?: string;
  note?: string;
}

export interface AdminSettings {
  require_second_approver_floor: boolean;
  require_second_approver_admin: boolean;
}
