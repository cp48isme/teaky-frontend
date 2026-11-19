import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError } from '../../api/client';
import { rememberSignedInEmail } from '../../lib/portalSession';

/** The one sign-in form (t04, 18 Nov 2026): used by the root page's card and
 * by /login, so both carry the same fields, the same errors and the same
 * "Forgot your password?" link. `next` and `portalSlug` are /login's
 * context; the root page passes none. */
export default function SignInForm({
  next = null,
  portalSlug,
  onSignedIn,
  emailPlaceholder = 'you@company.com',
}: {
  next?: string | null;
  portalSlug?: string;
  onSignedIn: () => Promise<void>;
  emailPlaceholder?: string;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password, portal_slug: portalSlug });
      rememberSignedInEmail(email);
      await onSignedIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const forgotHref = `/forgot-password?${new URLSearchParams({
    ...(email ? { email } : {}),
    ...(next ? { next } : {}),
  }).toString()}`;

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} data-testid="sign-in-form">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-dark">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
          placeholder={emailPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-dark">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 transition focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
          placeholder="Your password"
        />
        <p className="mt-2 text-right text-sm">
          <Link to={forgotHref} className="font-medium text-teak-dark transition hover:text-teak">
            Forgot your password?
          </Link>
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
