import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth';
import { lastPortalSlug, portalSlugFromPath, safeNextPath } from '../lib/portalSession';
import AuthShell from '../components/auth/AuthShell';

const SENT_SENTENCE = 'If that address has an account, a reset link is on its way. It works for 30 minutes.';

/** Forgot-password (29 Oct 2026). One answer for every address, so nothing on
 *  this page says whether an account exists. The portal context, when there
 *  is one, brands the email. */
export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const portalSlug = portalSlugFromPath(next) ?? lastPortalSlug() ?? undefined;
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await requestPasswordReset(email.trim(), portalSlug);
      setSent(true);
    } catch {
      setError('Something went wrong sending the link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login';

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a link to choose a new one">
      {sent ? (
        <div className="mt-8 space-y-5">
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{SENT_SENTENCE}</p>
          <p className="text-sm text-wood">
            Nothing in your inbox after a few minutes? Check the spam folder, or{' '}
            <button type="button" onClick={() => setSent(false)} className="font-medium text-teak-dark hover:text-teak">
              send it again
            </button>
            .
          </p>
          <Link to={loginHref} className="block text-center text-sm font-medium text-teak-dark hover:text-teak">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-dark">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Email me a reset link'}
          </button>
          <Link to={loginHref} className="block text-center text-sm font-medium text-teak-dark hover:text-teak">
            Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
