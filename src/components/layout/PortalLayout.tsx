import { Outlet, Link, useParams } from 'react-router-dom';
import { usePortalContext } from '../../contexts/PortalContext';
import { useCart } from '../../contexts/CartContext';
import { isAuthenticated } from '../../api/client';
import Spinner from '../ui/Spinner';

export default function PortalLayout() {
  const { slug } = useParams<{ slug: string }>();
  const { portal, loading, error } = usePortalContext();
  const { itemCount } = useCart();
  const authed = isAuthenticated();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-indigo-600" />
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

  const primaryColor = portal.brand_config?.primary_color || '#4F46E5';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header
        className="px-6 py-3 flex items-center justify-between shadow-sm"
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
        <nav className="flex items-center gap-4">
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
                to={`/p/${slug}/cart`}
                className="relative text-sm font-medium text-white/80 hover:text-white"
              >
                Cart
                {itemCount > 0 && (
                  <span
                    className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold"
                    style={{ color: primaryColor }}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            </>
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
            Powered by <span className="font-medium text-indigo-600">Teaky</span>
          </p>
        )}
      </footer>
    </div>
  );
}
