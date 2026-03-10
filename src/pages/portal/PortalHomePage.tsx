import { Link, useParams } from 'react-router-dom';
import { usePortalContext } from '../../contexts/PortalContext';

export default function PortalHomePage() {
  const { slug } = useParams<{ slug: string }>();
  const { portal, products } = usePortalContext();

  if (!portal) return null;

  const primaryColor = portal.brand_config?.primary_color || '#558B2F';
  const featured = products.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <div
        className="px-6 py-16 text-center text-white"
        style={{ backgroundColor: primaryColor }}
      >
        {portal.brand_config?.banner_image_url ? (
          <img
            src={portal.brand_config.banner_image_url}
            alt=""
            className="mx-auto mb-6 max-h-40 w-auto object-contain"
          />
        ) : (
          <>
            {portal.brand_config?.logo_url && (
              <img
                src={portal.brand_config.logo_url}
                alt=""
                className="mx-auto mb-4 h-16 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </>
        )}
        <h1 className="text-3xl font-bold">{portal.name}</h1>
        <p className="mt-2 text-white/80">Browse our product catalog</p>
        <Link
          to={`/p/${slug}/products`}
          className="mt-6 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-medium hover:bg-gray-100"
          style={{ color: primaryColor }}
        >
          View Products
        </Link>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/p/${slug}/products/${product.id}`}
                className="block rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
              >
                {product.mockup_urls.length > 0 ? (
                  <img
                    src={product.mockup_urls[0]}
                    alt={product.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                  {product.pricing_tiers.length > 0 && (
                    <p className="mt-1 text-sm font-medium" style={{ color: primaryColor }}>
                      From ${product.pricing_tiers[0].unit_price.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
