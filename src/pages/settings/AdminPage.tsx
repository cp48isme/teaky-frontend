import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  approveAdminProposal,
  declineAdminProposal,
  getAdminSettings,
  listAdminMembers,
  listAdminProposals,
  proposeAdminAction,
  updateAdminSettings,
} from '../../api/adminSurface';
import { listInvitations } from '../../api/team';
import type { AdminMember, AdminProposal, AdminProposalKind, AdminSettings } from '../../types/adminSurface';
import type { Invitation } from '../../types/team';
import { canAdministerShop, currentUserId } from '../../lib/roles';
import Spinner from '../../components/ui/Spinner';

/** The shop admin surface (t03, ruled 19 Nov 2026): every act here is a
 * proposal — deactivate, reactivate, remove, change role, resend or revoke an
 * invitation — recorded with a reason and applied only when approved; never on
 * oneself; never on the shop's last printer_admin; the two second-approver
 * switches. printer_admin only; the shadow_reader never sees it. */

const ROLE_OPTIONS = [
  { value: 'printer_admin', label: 'Printer Admin' },
  { value: 'store_creator', label: 'Portal Creator' },
  { value: 'sales_rep', label: 'Sales Rep' },
  { value: 'sales_team_lead', label: 'Sales Team Lead' },
  { value: 'billing_contact', label: 'Billing Contact' },
];

const KIND_LABEL: Record<AdminProposalKind, string> = {
  deactivate_member: 'Deactivate',
  reactivate_member: 'Reactivate',
  remove_member: 'Remove from shop',
  change_role: 'Change role',
  resend_invitation: 'Resend invitation',
  revoke_invitation: 'Revoke invitation',
};

const KIND_EFFECT: Record<AdminProposalKind, string> = {
  deactivate_member: 'keeps their rows, ends every session now and blocks sign-in until reactivated',
  reactivate_member: 'lets them sign in again with the roles they kept',
  remove_member: 'drops their roles on this shop only; their account and history stay',
  change_role: 'sets their role on this shop (at or below yours)',
  resend_invitation: 'sends a fresh invitation to the same address; the old link dies',
  revoke_invitation: 'ends the invitation; the link dies',
};

export interface PendingAct {
  kind: AdminProposalKind;
  targetKind: 'member' | 'invitation';
  targetId: string;
  label: string;
}

function fmt(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

export default function AdminPage() {
  const admin = canAdministerShop();
  const me = currentUserId();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [proposals, setProposals] = useState<AdminProposal[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [act, setAct] = useState<PendingAct | null>(null);
  const [reason, setReason] = useState('');
  const [newRole, setNewRole] = useState('sales_rep');
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const [m, i, p, s] = await Promise.all([
        listAdminMembers(),
        listInvitations(),
        listAdminProposals(),
        getAdminSettings(),
      ]);
      setMembers(m);
      setInvitations(i.filter((inv) => !inv.accepted_at && !inv.revoked_at));
      setProposals(p);
      setSettings(s);
      setError('');
    } catch {
      setError('Failed to load the admin surface');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (admin) void load();
    else setLoading(false);
  }, [admin, load]);

  const open = useMemo(() => proposals.filter((p) => p.status === 'proposed'), [proposals]);
  const decided = useMemo(() => proposals.filter((p) => p.status !== 'proposed'), [proposals]);

  const submit = async () => {
    if (!act || reason.trim().length < 3) return;
    setBusy(true);
    setError('');
    try {
      await proposeAdminAction({
        kind: act.kind,
        target_kind: act.targetKind,
        target_id: act.targetId,
        reason: reason.trim(),
        ...(act.kind === 'change_role' ? { new_role: newRole } : {}),
      });
      setAct(null);
      setReason('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The proposal was refused');
    } finally {
      setBusy(false);
    }
  };

  const decide = async (proposal: AdminProposal, approve: boolean) => {
    setBusy(true);
    setError('');
    try {
      if (approve) await approveAdminProposal(proposal.id, notes[proposal.id] ?? '');
      else await declineAdminProposal(proposal.id, notes[proposal.id] ?? '');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The decision was refused');
      await load();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (key: keyof AdminSettings) => {
    if (!settings) return;
    setBusy(true);
    try {
      setSettings(await updateAdminSettings({ ...settings, [key]: !settings[key] }));
    } catch {
      setError('Failed to save the switches');
    } finally {
      setBusy(false);
    }
  };

  if (!admin) {
    return (
      <p className="text-sm text-gray-600" data-testid="admin-no-access">
        The admin surface is the shop owner's (printer admin). You can see the team on the Team tab.
      </p>
    );
  }
  if (loading) return <Spinner />;

  const who = (id: string | null) => {
    if (!id) return '—';
    const m = members.find((x) => x.user_id === id);
    return m ? m.display_name || m.email : id === me ? 'you' : 'a member';
  };

  return (
    <div className="space-y-8" data-testid="admin-page">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <section>
        <h2 className="font-heading text-lg font-semibold text-brand-dark">Second approver</h2>
        <p className="mt-1 text-sm text-gray-600">
          With a switch on, the person who proposes an act cannot be the one who approves it. Both are off unless you turn them on.
        </p>
        {settings && (
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.require_second_approver_floor}
                disabled={busy}
                onChange={() => toggle('require_second_approver_floor')}
                aria-label="Require a second approver on the floor"
              />
              Floor acts (void, push alone, short run, mark done)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.require_second_approver_admin}
                disabled={busy}
                onChange={() => toggle('require_second_approver_admin')}
                aria-label="Require a second approver on admin acts"
              />
              Admin acts (deactivate, remove, role changes, invitations)
            </label>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-brand-dark">Members</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm" data-testid="admin-members">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Roles</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2 pr-4">Last sign-in</th>
                <th className="py-2 pr-4">Sessions</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const self = m.user_id === me;
                return (
                  <tr key={m.user_id} className="border-t border-gray-100" data-testid={`member-${m.user_id}`}>
                    <td className="py-2 pr-4">{m.display_name || '—'}{self ? ' (you)' : ''}</td>
                    <td className="py-2 pr-4">{m.email}</td>
                    <td className="py-2 pr-4">{m.roles.join(', ')}</td>
                    <td className="py-2 pr-4">{m.is_active ? 'Yes' : 'Deactivated'}</td>
                    <td className="py-2 pr-4">{fmt(m.last_sign_in_at)}</td>
                    <td className="py-2 pr-4 tabular-nums">{m.open_sessions}</td>
                    <td className="py-2 pr-4">
                      {self ? (
                        <span className="text-xs text-gray-500" data-testid="never-on-oneself">never on yourself</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {m.is_active ? (
                            <button type="button" className="text-xs text-red-700 underline" onClick={() => setAct({ kind: 'deactivate_member', targetKind: 'member', targetId: m.user_id, label: m.display_name || m.email })}>
                              Deactivate
                            </button>
                          ) : (
                            <button type="button" className="text-xs text-teak-dark underline" onClick={() => setAct({ kind: 'reactivate_member', targetKind: 'member', targetId: m.user_id, label: m.display_name || m.email })}>
                              Reactivate
                            </button>
                          )}
                          <button type="button" className="text-xs text-gray-700 underline" onClick={() => setAct({ kind: 'change_role', targetKind: 'member', targetId: m.user_id, label: m.display_name || m.email })}>
                            Change role
                          </button>
                          <button type="button" className="text-xs text-red-700 underline" onClick={() => setAct({ kind: 'remove_member', targetKind: 'member', targetId: m.user_id, label: m.display_name || m.email })}>
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-brand-dark">Pending invitations</h2>
        {invitations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">None pending.</p>
        ) : (
          <table className="mt-3 min-w-full text-sm" data-testid="admin-invitations">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Sent</th>
                <th className="py-2 pr-4">Expires</th>
                <th className="py-2 pr-4" />
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-100" data-testid={`invitation-${inv.id}`}>
                  <td className="py-2 pr-4">{inv.invited_email}</td>
                  <td className="py-2 pr-4">{inv.role}</td>
                  <td className="py-2 pr-4">{fmt(inv.created_at)}</td>
                  <td className="py-2 pr-4">{fmt(inv.expires_at)}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <button type="button" className="text-xs text-teak-dark underline" onClick={() => setAct({ kind: 'resend_invitation', targetKind: 'invitation', targetId: inv.id, label: inv.invited_email })}>
                        Resend
                      </button>
                      <button type="button" className="text-xs text-red-700 underline" onClick={() => setAct({ kind: 'revoke_invitation', targetKind: 'invitation', targetId: inv.id, label: inv.invited_email })}>
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {act && (
        <section className="rounded border border-gray-200 bg-gray-50 p-4" data-testid="propose-form" aria-label="Propose an admin act">
          <h3 className="text-sm font-semibold text-brand-dark">
            {KIND_LABEL[act.kind]}: {act.label}
          </h3>
          <p className="mt-1 text-xs text-gray-600">
            Nothing happens until it is approved. Approving {KIND_EFFECT[act.kind]}.
          </p>
          {act.kind === 'change_role' && (
            <select aria-label="New role" className="mt-2 rounded border px-2 py-1 text-sm" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          )}
          <textarea
            aria-label="Reason"
            className="mt-2 w-full rounded border px-2 py-1 text-sm"
            rows={2}
            placeholder="Why (kept with the record)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button type="button" className="rounded bg-teak-dark px-3 py-1 text-sm text-white disabled:opacity-50" disabled={busy || reason.trim().length < 3} onClick={submit} data-testid="propose-submit">
              Propose
            </button>
            <button type="button" className="rounded border px-3 py-1 text-sm" disabled={busy} onClick={() => { setAct(null); setReason(''); }}>
              Cancel
            </button>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-heading text-lg font-semibold text-brand-dark">Proposals</h2>
        {open.length === 0 && <p className="mt-2 text-sm text-gray-500" data-testid="no-open">Nothing waiting for a decision.</p>}
        <ul className="mt-3 space-y-3" data-testid="admin-ledger">
          {open.map((p) => {
            const mine = p.proposed_by === me;
            const target = p.facts.member ? p.facts.member.display_name || p.facts.member.email : p.facts.invitation?.invited_email ?? p.target_id;
            return (
              <li key={p.id} className="rounded border border-gray-200 p-3 text-sm" data-testid={`proposal-${p.id}`}>
                <div className="font-medium">
                  {KIND_LABEL[p.kind]}: {target}
                  {p.new_role ? ` → ${p.new_role}` : ''}
                </div>
                <div className="text-xs text-gray-600">
                  Proposed by {who(p.proposed_by)} on {fmt(p.proposed_at)} — "{p.reason}"
                </div>
                {p.facts.member && (
                  <div className="text-xs text-gray-500">
                    At the time: {p.facts.member.roles.join(', ')}; {p.facts.member.is_active ? 'active' : 'deactivated'}; last sign-in {fmt(p.facts.member.last_sign_in_at)}; {p.facts.member.open_sessions} open session(s)
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input aria-label="Decision note" className="rounded border px-2 py-1 text-xs" placeholder="note (optional)" value={notes[p.id] ?? ''} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })} />
                  <button type="button" className="rounded bg-teak-dark px-3 py-1 text-xs text-white disabled:opacity-50" disabled={busy} onClick={() => decide(p, true)} data-testid="approve">
                    Approve
                  </button>
                  <button type="button" className="rounded border px-3 py-1 text-xs" disabled={busy} onClick={() => decide(p, false)} data-testid="decline">
                    {mine && settings?.require_second_approver_admin ? 'Withdraw' : 'Decline'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {decided.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600">Decided ({decided.length})</summary>
            <ul className="mt-2 space-y-2 text-xs text-gray-600">
              {decided.map((p) => (
                <li key={p.id} data-testid={`decided-${p.id}`}>
                  {KIND_LABEL[p.kind]} — {p.status}
                  {p.failure ? ` — ${p.failure}` : ''} — by {who(p.decided_by)} on {fmt(p.decided_at)}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}
