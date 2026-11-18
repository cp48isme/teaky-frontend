import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { isAuthenticated, switchOrganization } from '../api/client';
import { acceptInvitation, getInvitationPreview, registerFromInvitation } from '../api/team';
import type { InvitationPreview } from '../types/team';
import { rememberPortal, rememberSignedInEmail } from '../lib/portalSession';
import { isBuyerRole, landingForInvitation } from '../lib/roles';
import {
  forgetInviteToken,
  inviteFragmentPath,
  readInviteFragment,
  rememberInviteToken,
  resolveInviteToken,
} from '../lib/inviteLink';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';

// S86, the proper invited-buyer path: the page reads the invitation, a visitor
// without an account sets a password and lands on the invited portal, and a
// signed-in visitor accepts and is moved into the inviting organisation. Nobody
// is sent to the printer registration form or the printer dashboard.

export default function AcceptInvitationPage() {
  // The token arrives in the fragment (never sent to a server); a path-form link
  // from before 29 Oct 2026 still resolves and is rewritten to the fragment form.
  const { token: pathToken } = useParams<{ token: string }>();
  const { hash } = useLocation();
  const token = resolveInviteToken(hash, pathToken);
  const navigate = useNavigate();
  const { markSignedIn } = useAuth();
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const authed = isAuthenticated();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    // Parked for the sign-in round trip, so no ?next= ever carries it.
    rememberInviteToken(token);
    if (pathToken && !readInviteFragment(hash)) {
      window.history.replaceState(null, '', inviteFragmentPath(token));
    }
    getInvitationPreview(token)
      .then(setPreview)
      .catch(() => setPreview(null))
      .finally(() => setLoading(false));
  }, [token, pathToken, hash]);

  // By role, not by portal (ruling 17 Nov 2026): a buyer lands on the invited
  // portal; staff and the shadow_reader land on the production screens even
  // when the invitation names a portal.
  const landing = landingForInvitation(preview?.role, preview?.portal_slug);
  // A buyer is going to the portal; staff and the shadow_reader are going to
  // the shop's production screens, so the name and the verb follow the role.
  const buyer = isBuyerRole(preview?.role);
  const destinationName = (buyer ? preview?.portal_name : null) ?? preview?.organization_name ?? '';
  const purpose = buyer ? `order for ${destinationName}` : `work with ${destinationName}`;

  const finish = () => {
    forgetInviteToken();
    // Only a buyer's portal is remembered for the next sign-in; a staff or
    // shadow_reader sign-in must not be pulled back to the storefront.
    if (preview?.portal_slug && isBuyerRole(preview.role)) rememberPortal(preview.portal_slug);
    navigate(landing, { replace: true });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setWorking(true);
    setError('');
    try {
      await registerFromInvitation(token, password, displayName.trim());
      if (preview) rememberSignedInEmail(preview.invited_email);
      // The registration issued the session; the guarded landing must see it
      // now, or it bounces the new user through /login (walk of 18 Nov 2026).
      markSignedIn();
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set your password');
    } finally {
      setWorking(false);
    }
  };

  const handleAccept = async () => {
    if (!token) return;
    setWorking(true);
    setError('');
    try {
      const invitation = await acceptInvitation(token);
      await switchOrganization(invitation.organization_id);
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setWorking(false);
    }
  };

  const shell = (body: React.ReactNode) => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8">{body}</div>
    </div>
  );

  if (loading) {
    return shell(<Spinner className="mx-auto h-6 w-6 text-teak-dark" />);
  }

  if (!preview) {
    return shell(
      <>
        <h1 className="text-xl font-bold text-gray-900">This invitation link is not valid</h1>
        <p className="mt-3 text-sm text-gray-600">Ask the person who invited you to send a new one.</p>
      </>,
    );
  }

  if (preview.state !== 'valid') {
    const reason = {
      expired: 'This invitation has expired.',
      accepted: 'This invitation has already been used.',
      revoked: 'This invitation was withdrawn.',
    }[preview.state];
    return shell(
      <>
        <h1 className="text-xl font-bold text-gray-900">{reason}</h1>
        <p className="mt-3 text-sm text-gray-600">
          {preview.state === 'accepted' ? (
            <>
              Sign in to {purpose}.{' '}
              <Link to={`/login?next=${encodeURIComponent(landing)}`} className="font-medium text-teak-dark">
                Sign in
              </Link>
            </>
          ) : (
            'Ask the person who invited you to send a new one.'
          )}
        </p>
      </>,
    );
  }

  const errorBox = error && (
    <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
  );

  if (authed) {
    return shell(
      <>
        <h1 className="text-xl font-bold text-gray-900">You're invited to {destinationName}</h1>
        <p className="mt-3 text-sm text-gray-600">
          Accept to {purpose} with the account you're signed in as.
        </p>
        {errorBox}
        <button
          onClick={handleAccept}
          disabled={working}
          className="mt-6 w-full rounded-md bg-teak-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {working ? <Spinner className="mx-auto h-5 w-5 text-white" /> : 'Accept invitation'}
        </button>
      </>,
    );
  }

  if (preview.account_exists) {
    return shell(
      <>
        <h1 className="text-xl font-bold text-gray-900">You're invited to {destinationName}</h1>
        <p className="mt-3 text-sm text-gray-600">
          {preview.invited_email} already has an account. Sign in and you'll be able to accept, or reset
          your password if you have forgotten it.
        </p>
        <Link
          to="/login?next=%2Finvite"
          className="mt-6 block w-full rounded-md bg-teak-dark px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-teak"
        >
          Sign in
        </Link>
        <Link
          to={`/forgot-password?${new URLSearchParams({ email: preview.invited_email, next: '/invite' }).toString()}`}
          className="mt-3 block w-full rounded-md border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-teak-dark hover:bg-gray-50"
        >
          Reset your password
        </Link>
      </>,
    );
  }

  return shell(
    <>
      <h1 className="text-xl font-bold text-gray-900">You're invited to {destinationName}</h1>
      <p className="mt-3 text-sm text-gray-600">
        Set a password for <span className="font-medium text-gray-900">{preview.invited_email}</span> and
        you'll go straight to {destinationName}.
      </p>
      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <div>
          <label htmlFor="invite-name" className="block text-sm font-medium text-gray-700">
            Your name
          </label>
          <input
            id="invite-name"
            type="text"
            maxLength={120}
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="So your printer knows who is ordering"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak"
          />
        </div>
        <div>
          <label htmlFor="invite-password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="invite-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak"
          />
        </div>
        {errorBox}
        <button
          type="submit"
          disabled={working}
          className="w-full rounded-md bg-teak-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {working ? <Spinner className="mx-auto h-5 w-5 text-white" /> : `Set password and go to ${destinationName}`}
        </button>
      </form>
    </>,
  );
}
