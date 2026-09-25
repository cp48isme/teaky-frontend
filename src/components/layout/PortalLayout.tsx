import { useEffect } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import { usePortalContext } from '../../contexts/PortalContext';
import { useCart } from '../../contexts/CartContext';
import { isAuthenticated } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { rememberPortal, signedInEmail, forgetSignedInEmail } from '../../lib/portalSession';
import Spinner from '../ui/Spinner';

export default function PortalLayout() {
  const { slug } = useParams<{ slug: string }>();
  const { portal, loading, error } = usePortalContext();
  const { itemCount } = useCart();
  const authed = isAuthenticated();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const email = authed ? signedInEmail() : null;

  const signOut = async () => {
    try {
      await logout();
    } finally {
      forgetSignedInEmail();
      navigate(`/p/${slug}`);
    }
  };

  useEffect(() => {
    if (slug) rememberPortal(slug);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (error || !portal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Portal Not Found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This portal doesn't exist or is not currently active.
          </p>
        </div>
      </div>
    );
  }

  const primaryColor = portal.brand_config?.primary_color || '#558B2F';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header
        className="px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          {portal.brand_config?.logo_url && (
            <img
              src={portal.brand_config.logo_url}
              alt=""
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <Link to={`/p/${slug}`} className="text-lg font-semibold text-white">
            {portal.name}
          </Link>
        </div>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <Link
            to={`/p/${slug}`}
            className="text-sm font-medium text-white/80 hover:text-white"
          >
            Home
          </Link>
          <Link
            to={`/p/${slug}/products`}
            className="text-sm font-medium text-white/80 hover:text-white"
          >
            Products
          </Link>
          {authed && (
            <>
              <Link
                to={`/p/${slug}/orders`}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                My Orders
              </Link>
              <Link
                to={`/p/${slug}/quotes`}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                Quotes
              </Link>
              <Link
                to={`/p/${slug}/cart`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
              >
                Cart
                {itemCount > 0 && (
                  <span
                    className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-bold leading-none"
                    style={{ color: primaryColor }}
                    aria-label={`${itemCount} items in cart`}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
              <span className="ml-2 border-l border-white/30 pl-3 text-xs text-white/80">
                {email ? <span title={email}>{email}</span> : 'Signed in'}
                {' · '}
                <button
                  type="button"
                  onClick={signOut}
                  className="font-medium text-white/90 underline-offset-2 hover:underline"
                >
                  Sign out
                </button>
              </span>
            </>
          )}
          {!authed && (
            <Link
              to={`/login?next=/p/${slug}`}
              className="rounded-md bg-white/15 px-3 py-1 text-sm font-medium text-white hover:bg-white/25"
            >
              Sign in
            </Link>
          )}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-4 text-center">
        {portal.brand_config?.powered_by_teaky !== false && (
          <p className="text-xs text-gray-400">
            Powered by <span className="font-medium text-teak-dark">Teaky</span>
          </p>
        )}
      </footer>
    </div>
  );
}
