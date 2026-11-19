import { Link, useSearchParams } from 'react-router-dom';
import { usePostLoginRedirect } from '../hooks/usePostLoginRedirect';
import { portalSlugFromPath, lastPortalSlug } from '../lib/portalSession';
import SignInForm from '../components/auth/SignInForm';
import { useSignupAvailability } from '../hooks/useSignupAvailability';

export default function LoginPage() {
  const postLoginRedirect = usePostLoginRedirect();
  const [searchParams] = useSearchParams();
  const fromPortal = (portalSlugFromPath(searchParams.get('next')) ?? lastPortalSlug()) !== null;
  // t04 (18 Nov 2026): the offer is shown only when the server says public sign-up is on.
  const signupOn = useSignupAvailability();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-light">
      {/* Soft background washes — clipped by the container so a phone never scrolls sideways (ruling 2026-10-21) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
            <h2 className="font-heading text-2xl font-bold text-brand-dark">Sign in</h2>
            <p className="mt-1 text-sm text-wood">Your ordering portal and orders</p>

            <SignInForm
              next={searchParams.get('next')}
              portalSlug={portalSlugFromPath(searchParams.get('next')) ?? lastPortalSlug() ?? undefined}
              onSignedIn={() => postLoginRedirect(searchParams.get('next'))}
            />

            {!fromPortal && signupOn && (
              <p className="mt-6 text-center text-sm text-wood">
                New to Teaky?{' '}
                <Link to="/register" className="font-medium text-teak-dark transition hover:text-teak">
                  Create a free account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
