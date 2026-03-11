import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getPortal,
  publishPortal,
  invitePortalUser,
  listPortalInvitations,
  duplicatePortal,
} from '../api/portals';
import type { Portal } from '../types/portal';
import type { Invitation } from '../types/team';
import Spinner from '../components/ui/Spinner';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SplitScreenLayout from '../components/layout/SplitScreenLayout';

export default function PortalDetailPage() {
  const { portalId } = useParams<{ portalId: string }>();
  const navigate = useNavigate();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('end_user');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateLocation, setDuplicateLocation] = useState('');
  const [duplicateSubdomain, setDuplicateSubdomain] = useState('');
  const [duplicating, setDuplicating] = useState(false);

  useEffect(() => {
    if (!portalId) return;
    getPortal(portalId)
      .then(setPortal)
      .catch(() => setError('Portal not found'))
      .finally(() => setLoading(false));
    listPortalInvitations(portalId)
      .then(setInvitations)
      .catch(() => {});
  }, [portalId]);

  const handlePublish = async () => {
    if (!portalId) return;
    setPublishing(true);
    try {
      const updated = await publishPortal(portalId);
      setPortal(updated);
    } catch {
      setError('Failed to publish portal');
    } finally {
      setPublishing(false);
    }
  };

  const handleDuplicate = async () => {
    if (!portalId || !duplicateLocation.trim()) return;
    setDuplicating(true);
    try {
      const newPortal = await duplicatePortal(portalId, {
        location_name: duplicateLocation,
        custom_subdomain: duplicateSubdomain || null,
      });
      setShowDuplicateModal(false);
      setDuplicateLocation('');
      setDuplicateSubdomain('');
      navigate(`/portals/${newPortal.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate portal');
    } finally {
      setDuplicating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (error || !portal) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-600">{error || 'Portal not found'}</p>
        <Link to="/portals" className="mt-2 text-sm text-teak-dark hover:text-teak">
          Back to portals
        </Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    paused: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800',
  };

  return (
    <SplitScreenLayout
      leftContent={
        <div className="space-y-6">
          <Breadcrumbs items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Portals', to: '/portals' },
            { label: portal.name },
          ]} />
          {/* Header */}
          <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-brand-dark">{portal.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* View Live Store Button */}
          <a
            href={`/p/${portal.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-teak to-teak-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition"
          >
            <span>🌐</span>
            View Live Store
          </a>

          {portal.is_template && (
            <button
              onClick={() => setShowDuplicateModal(true)}
              className="rounded-md border border-purple-600 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
            >
              + Duplicate for New Location
            </button>
          )}
          {portal.status === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[portal.status] ?? 'bg-gray-100 text-gray-800'}`}
          >
            {portal.status}
          </span>
        </div>
      </div>

      {/* Duplicate Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Duplicate Portal</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create a new portal for a different location based on: <strong>{portal.name}</strong>
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={duplicateLocation}
                  onChange={(e) => setDuplicateLocation(e.target.value)}
                  placeholder="e.g., Downtown Seattle"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Custom Subdomain <span className="text-gray-400">(optional)</span>
                </label>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm text-gray-500">teaky.com/p/</span>
                  <input
                    type="text"
                    value={duplicateSubdomain}
                    onChange={(e) =>
                      setDuplicateSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    placeholder="auto-generated"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Leave blank to auto-generate from location name</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateLocation('');
                  setDuplicateSubdomain('');
                }}
                disabled={duplicating}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicate}
                disabled={duplicating || !duplicateLocation.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {duplicating && <Spinner className="h-4 w-4 text-white" />}
                Duplicate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portal Details */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Details</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Slug</dt>
              <dd className="font-mono text-gray-900">{portal.slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Type</dt>
              <dd className="text-gray-900">{portal.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created Via</dt>
              <dd className="text-gray-900">{portal.created_via}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Approval</dt>
              <dd className="text-gray-900">{portal.approval_workflow.replace(/_/g, ' ')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Self-Registration</dt>
              <dd className="text-gray-900">{portal.self_registration ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Require PO</dt>
              <dd className="text-gray-900">{portal.require_po ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        {/* Branding */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Branding</h3>
          <div className="mt-3 space-y-3">
            {portal.brand_config?.logo_url && (
              <div>
                <p className="text-xs text-gray-500">Logo</p>
                <img
                  src={portal.brand_config.logo_url}
                  alt="Portal logo"
                  className="mt-1 h-10 w-auto object-contain rounded border p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Colors</p>
              <div className="mt-1 flex gap-2">
                {[
                  portal.brand_config?.primary_color,
                  portal.brand_config?.secondary_color,
                  portal.brand_config?.accent_color,
                ]
                  .filter(Boolean)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color! }}
                      title={color!}
                    />
                  ))}
                {![
                  portal.brand_config?.primary_color,
                  portal.brand_config?.secondary_color,
                  portal.brand_config?.accent_color,
                ].some(Boolean) && (
                  <span className="text-sm text-gray-400">No colors configured</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to={`/portals/${portal.id}/products`}
          className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak"
        >
          Manage Products
        </Link>
        {portal.status === 'active' && (
          <Link
            to={`/p/${portal.slug}`}
            target="_blank"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Public Portal &rarr;
          </Link>
        )}
      </div>

      {/* Invite Users */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Invite Users
        </h3>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!portalId || !inviteEmail.trim()) return;
            setInviting(true);
            setInviteError('');
            try {
              const inv = await invitePortalUser(portalId, inviteEmail, inviteRole);
              setInvitations((prev) => [inv, ...prev]);
              setInviteEmail('');
            } catch {
              setInviteError('Failed to send invitation');
            } finally {
              setInviting(false);
            }
          }}
        >
          <input
            type="email"
            placeholder="user@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
            required
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="end_user">End User</option>
            <option value="portal_admin">Portal Admin</option>
          </select>
          <button
            type="submit"
            disabled={inviting}
            className="rounded-md bg-teak-dark px-4 py-1.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {inviting ? 'Sending...' : 'Invite'}
          </button>
        </form>
        {inviteError && (
          <p className="mt-2 text-xs text-red-600">{inviteError}</p>
        )}

        {invitations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase">
              Pending Invitations
            </h4>
            <div className="mt-2 space-y-1">
              {invitations
                .filter((inv) => !inv.accepted_at && !inv.revoked_at)
                .map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded border border-gray-100 px-3 py-1.5 text-sm"
                  >
                    <span className="text-gray-700">{inv.invited_email}</span>
                    <span className="text-xs text-gray-400">
                      {inv.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
        </div>
      }
      previewUrl={`/p/${portal.slug}`}
    />
  );
}
