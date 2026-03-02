import { useState, useEffect } from 'react';
import {
  listMembers,
  inviteMember,
  removeMember,
  listInvitations,
  revokeInvitation,
  updateMember,
} from '../../api/team';
import type { TeamMember, Invitation } from '../../types/team';
import Spinner from '../../components/ui/Spinner';

const ROLE_OPTIONS = [
  { value: 'printer_admin', label: 'Printer Admin' },
  { value: 'store_creator', label: 'Store Creator' },
  { value: 'sales_rep', label: 'Sales Rep' },
  { value: 'sales_team_lead', label: 'Sales Team Lead' },
  { value: 'billing_contact', label: 'Billing Contact' },
  { value: 'portal_admin', label: 'Portal Admin' },
  { value: 'sub_portal_admin', label: 'Sub-Portal Admin' },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('sales_rep');
  const [inviting, setInviting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [m, i] = await Promise.all([listMembers(), listInvitations()]);
      setMembers(m);
      setInvitations(i.filter((inv) => !inv.accepted_at && !inv.revoked_at));
    } catch {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError('');
    try {
      await inviteMember({ email: inviteEmail, role: inviteRole });
      setInviteEmail('');
      await loadData();
    } catch {
      setError('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMember(userId);
      await loadData();
    } catch {
      setError('Failed to remove member');
    }
  };

  const handleRevoke = async (invId: string) => {
    try {
      await revokeInvitation(invId);
      await loadData();
    } catch {
      setError('Failed to revoke invitation');
    }
  };

  const handleUpdateRole = async (userId: string) => {
    try {
      await updateMember(userId, { role: editRole });
      setEditingId(null);
      await loadData();
    } catch {
      setError('Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Invite Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
        <form onSubmit={handleInvite} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="colleague@company.com"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {inviting ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Pending Invitations</h2>
          <div className="mt-4 space-y-3">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.invited_email}</p>
                  <p className="text-xs text-gray-500">
                    Role: {inv.role.replace(/_/g, ' ')} &middot; Expires{' '}
                    {new Date(inv.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(inv.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                  Portals
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((m) => (
                <tr key={m.user_id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{m.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingId === m.user_id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleUpdateRole(m.user_id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {m.roles.map((r) => (
                          <span
                            key={r}
                            className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                          >
                            {r.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {m.portal_assignments.length > 0
                      ? m.portal_assignments.map((a) => a.portal_name).join(', ')
                      : 'All'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button
                      onClick={() => {
                        setEditingId(m.user_id);
                        setEditRole(m.roles[0] || 'sales_rep');
                      }}
                      className="mr-3 text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(m.user_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
