import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { confirmPasswordReset, requestPasswordReset } from '../api/auth';
import { ApiError } from '../api/client';
import AuthShell from '../components/auth/AuthShell';
import { readResetFragment } from '../lib/resetLink';

type Stage = 'form' | 'done' | 'invalid' | 'resent';

/** Forgot-password, step two (29 Oct 2026). An expired or used link is not a
 *  dead end: the page offers a fresh link in one click, with nothing retyped. */
export default function ResetPasswordPage() {
  const fragment = useMemo(() => readResetFragment(window.location.hash), []);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [stage, setStage] = useState<Stage>(fragment.token ? 'form' : 'invalid');
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const [doneDetail, setDoneDetail] = useState('');

  const loginHref = fragment.portal ? `/login?next=${encodeURIComponent(`/p/${fragment.portal}`)}` : '/login';
  const forgotHref = `/forgot-password?${new URLSearchParams({
    ...(fragment.email ? { email: fragment.email } : {}),
    ...(fragment.portal ? { next: `/p/${fragment.portal}` } : {}),
  }).toString()}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setWorking(true);
    try {
      const result = await confirmPasswordReset(fragment.token, password);
      setDoneDetail(result.detail);
      setStage('done');
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setStage('invalid');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setWorking(false);
    }
  };

  const sendFresh = async () => {
    setWorking(true);
    setError('');
    try {
      await requestPasswordReset(fragment.email, fragment.portal || undefined);
      setStage('resent');
    } catch {
      setError('Something went wrong sending the link. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  if (stage === 'done') {
    return (
      <AuthShell title="Password updated" subtitle="You can sign in with it now">
        <p className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{doneDetail}</p>
        <Link
          to={loginHref}
          className="mt-6 block w-full rounded-lg bg-teak-dark py-2.5 text-center text-sm font-semibold text-white shadow transition hover:bg-teak"
        >
          Sign in
        </Link>
      </AuthShell>
    );
  }

  if (stage === 'resent') {
    return (
      <AuthShell title="A new link is on its way" subtitle={fragment.email ? `Sent to ${fragment.email}` : undefined}>
        <p className="mt-6 text-sm text-wood">
          If that address has an account, the new link arrives within a few minutes and works for 30 minutes. This
          page can be closed.
        </p>
      </AuthShell>
    );
  }

  if (stage === 'invalid') {
    return (
      <AuthShell title="This link has expired" subtitle="Reset links work for 30 minutes and once only">
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {fragment.email ? (
          <button
            type="button"
            onClick={sendFresh}
            disabled={working}
            className="mt-6 w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50"
          >
            {working ? 'Sending…' : `Send me a new link`}
          </button>
        ) : (
          <Link
            to={forgotHref}
            className="mt-6 block w-full rounded-lg bg-teak-dark py-2.5 text-center text-sm font-semibold text-white shadow transition hover:bg-teak"
          >
            Request a new link
          </Link>
        )}
        <Link to={loginHref} className="mt-4 block text-center text-sm font-medium text-teak-dark hover:text-teak">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" subtitle={fragment.email ? `For ${fragment.email}` : undefined}>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-brand-dark">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-dark">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
            placeholder="Same again"
          />
        </div>
        <button
          type="submit"
          disabled={working}
          className="w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50"
        >
          {working ? 'Saving…' : 'Set new password'}
        </button>
        <p className="text-xs text-wood">Any other device you were signed in on signs out within 15 minutes.</p>
      </form>
    </AuthShell>
  );
}
