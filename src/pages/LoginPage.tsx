import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';
import { usePostLoginRedirect } from '../hooks/usePostLoginRedirect';

export default function LoginPage() {
  const { login } = useAuth();
  const postLoginRedirect = usePostLoginRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      await postLoginRedirect();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light">
      {/* Soft background washes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-teak/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-teak-light/6 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/teaky-logo.svg" alt="Teaky" className="h-10 w-10" />
            <span className="font-heading text-xl font-bold text-brand-dark">teaky</span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/5">
          <div className="h-1 bg-gradient-to-r from-teak-dark via-teak to-teak-light" />
          <div className="p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-dark">Sign in to Teaky</h2>
            <p className="mt-1 text-sm text-wood">Access your portals, orders, and AI agents</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="you@yourshop.com"
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
                  placeholder="Min 8 characters"
                />
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

            <p className="mt-6 text-center text-sm text-wood">
              New to Teaky?{' '}
              <Link to="/register" className="font-medium text-teak-dark transition hover:text-teak">
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
