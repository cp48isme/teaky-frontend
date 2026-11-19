import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword, listSessions, logoutAll, type SessionSummary } from '../api/auth';
import { ApiError } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import AuthShell from '../components/auth/AuthShell';

/** /account (t01, 18 Nov 2026): change password (the current one required;
 * every other session ends), sign out, sign out everywhere, and the sessions
 * list. Reached from every layout's user menu. */

const field =
  'mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak';

function ago(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 90) return 'just now';
  if (seconds < 5400) return `${Math.round(seconds / 60)} min ago`;
  if (seconds < 129600) return `${Math.round(seconds / 3600)} h ago`;
  return `${Math.round(seconds / 86400)} d ago`;
}

export default function AccountPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionSummary[] | null>(null);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    listSessions()
      .then(setSessions)
      .catch(() => setSessions([]));

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (next !== confirm) {
      setError('The new password and its confirmation differ');
      return;
    }
    setBusy(true);
    try {
      const changed = await changePassword(current, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      setNotice(
        changed.other_sessions_ended === 0
          ? 'Password changed. No other session was open.'
          : `Password changed. ${changed.other_sessions_ended} other session${changed.other_sessions_ended === 1 ? '' : 's'} ended; this one keeps going.`,
      );
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not change the password');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const signOutEverywhere = async () => {
    await logoutAll();
    navigate('/login', { replace: true });
  };

  return (
    <AuthShell title="Your account" subtitle="Password and sessions">
      <form className="mt-6 space-y-4" onSubmit={submit} data-testid="change-password-form">
        {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}
        <div>
          <label htmlFor="current" className="block text-sm font-medium text-brand-dark">Current password</label>
          <input id="current" type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="next" className="block text-sm font-medium text-brand-dark">New password</label>
          <input id="next" type="password" required minLength={8} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={field} placeholder="Min 8 characters" />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-brand-dark">New password, again</label>
          <input id="confirm" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50">
          Change password
        </button>
        <p className="text-xs text-wood">Changing it signs out every other browser and device at once; this one keeps going.</p>
      </form>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-semibold text-brand-dark">Sessions</h3>
        {sessions === null ? (
          <p className="mt-2 text-sm text-wood">Loading…</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-wood" data-testid="sessions">
            {sessions.map((s) => (
              <li key={s.id} data-current={s.current ? 'true' : 'false'}>
                {s.current ? <strong>This session</strong> : 'Another session'} · opened {ago(s.created_at)} · expires {new Date(s.expires_at).toLocaleDateString('en-US')}
              </li>
            ))}
            {sessions.length === 0 ? <li>No session is open.</li> : null}
          </ul>
        )}
        <p className="mt-1 text-xs text-wood">Signing out ends a session at once, on the server.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={signOut} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-gray-50">
            Sign out
          </button>
          <button type="button" onClick={signOutEverywhere} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50">
            Sign out everywhere
          </button>
        </div>
      </div>
      <p className="mt-6 text-center text-sm">
        <Link to="/" className="font-medium text-teak-dark transition hover:text-teak">Back</Link>
      </p>
    </AuthShell>
  );
}
