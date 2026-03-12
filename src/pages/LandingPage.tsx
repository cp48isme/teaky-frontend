import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';
import { usePostLoginRedirect } from '../hooks/usePostLoginRedirect';

const FEATURES = [
  {
    title: 'Branded customer portals',
    description:
      'Launch white-labeled ordering portals for each client. Your branding, your products, your way.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a2.625 2.625 0 0 1 0-3.712L12 2.25l8.25 3.387a2.625 2.625 0 0 1 0 3.712M3.75 9.349H20.25" />
      </svg>
    ),
  },
  {
    title: 'Agents that work alongside you',
    description:
      'An ensemble of dedicated AI agents handles quoting, design review, and quality assurance around the clock — so your team can focus on production.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: 'Orders & proofs, streamlined',
    description:
      'From cart to production-ready files. Agent-assisted digital proofing, approval tracking, and file management all in one place.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    title: 'Know your numbers',
    description:
      'Track revenue, order volume, and portal performance with dashboards that actually make sense.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: 'Connects to what you use',
    description:
      'Sync with Printavo, shopVOX, DocketManager, QuickBooks, and more. Orders and invoices flow automatically.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
  {
    title: 'Your whole team, in the loop',
    description:
      'Invite staff, assign roles, and keep everyone updated with real-time notifications.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-brand-light">
      {/* ───── NAV ───── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/teaky-logo.svg" alt="Teaky" className="h-9 w-9" />
            <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">
              teaky
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-bark transition hover:text-teak sm:block"
            >
              Features
            </a>
            <button
              onClick={() =>
                document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hidden text-sm font-medium text-bark transition hover:text-teak sm:block"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-full bg-coral px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:shadow-md"
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* Soft background washes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-teak/8 blur-[120px]" />
          <div className="absolute top-40 -left-24 h-[400px] w-[400px] rounded-full bg-teak-light/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 h-[300px] w-[300px] rounded-full bg-gold/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 lg:pt-24">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left — copy */}
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-teak/20 bg-teak/5 px-4 py-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-teak-dark">
                  Human · Agent Commerce
                </span>
              </div>

              <h1 className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-brand-dark sm:text-6xl lg:text-7xl">
                Vision, meet{' '}
                <span className="bg-gradient-to-r from-teak-dark via-teak to-teak-light bg-clip-text text-transparent">
                  velocity.
                </span>
              </h1>

              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
                Grow without the grind.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark">
                Stop just selling products — start offering a service. Teaky lets you create custom storefronts for every client, streamline design-to-delivery, and automate the work that slows you down. Purpose-built AI agents handle the heavy lifting so your team can focus on relationships, not repetition. This isn&apos;t AI bolted onto old workflows — it&apos;s a platform designed for the way business works now.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="rounded-full bg-coral px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral/25 transition hover:brightness-110 hover:shadow-xl hover:shadow-coral/30"
                >
                  Start Free Trial
                </button>
                <a
                  href="#features"
                  className="rounded-full border border-teak/30 px-8 py-3.5 text-sm font-semibold text-teak-dark transition hover:border-teak hover:bg-teak/5"
                >
                  See Features
                </a>
              </div>
            </div>

            {/* Right — login card */}
            <div id="login-form" className="relative">
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
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-brand-dark"
                      >
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
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-brand-dark"
                      >
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
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
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
                    <Link
                      to="/register"
                      className="font-medium text-teak-dark transition hover:text-teak"
                    >
                      Create a free account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="relative bg-white py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-teak/20 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-teak">
              Built for your business
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-brand-dark sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-bark">
              From customer-facing portals to back-office agents, Teaky handles the entire workflow
              so you can focus on what you do best.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 transition hover:border-teak/20 hover:shadow-lg hover:shadow-teak/5"
              >
                <div className="mb-5 inline-flex rounded-xl bg-teak/10 p-3 text-teak transition group-hover:bg-teak/15">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-dark">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bark">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-gradient-to-br from-teak-dark to-teak py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Ready to grow your business?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join businesses already using Teaky to streamline their workflow and delight their
            customers.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="rounded-full bg-white px-10 py-3.5 text-sm font-semibold text-teak-dark shadow-lg transition hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() =>
                document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-full border border-white/30 px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-brand-dark py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
            <div className="flex items-center gap-2">
              <img src="/teaky-logo.svg" alt="Teaky" className="h-7 w-7" />
              <span className="font-heading text-sm font-semibold text-white">teaky</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <Link to="/about" className="text-sm text-gray-400 transition hover:text-white">About</Link>
              <Link to="/privacy" className="text-sm text-gray-400 transition hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-400 transition hover:text-white">Terms of Service</Link>
              <Link to="/security" className="text-sm text-gray-400 transition hover:text-white">Security</Link>
              <Link to="/contact" className="text-sm text-gray-400 transition hover:text-white">Contact</Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Teaky. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
