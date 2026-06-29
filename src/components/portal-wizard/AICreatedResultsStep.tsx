import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProducts } from '../../api/products';
import type { StoreCreationResult } from '../../api/portals';
import type { Product } from '../../types/product';

interface Props {
  result: StoreCreationResult;
  onCreateNew?: () => void;
}

export default function AICreatedResultsStep({ result, onCreateNew }: Props) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products for the portal
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await listProducts(result.portal_id);
        setProducts(productList);
      } catch {
        // Silently fail - we'll show count even if can't fetch details
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [result.portal_id]);

  const brandColors = result.brand_assets_found.colors;
  const hasLogo = result.brand_assets_found.logo;
  const hasBranding = hasLogo || brandColors.length > 0;

  return (
    <form className="space-y-8">
      {/* Success banner */}
      <div className="rounded-lg border-2 border-green-300 bg-gradient-to-r from-green-50 to-teal-50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-pulse">✨</div>
          <div className="flex-1">
            <p className="text-lg font-bold text-green-900">Portal Created Successfully!</p>
            <p className="mt-1 text-sm text-green-700">
              Your AI-generated portal is live and ready to customize. Everything was built in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Portal Header with Logo and Brand Info */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{result.portal_name}</h2>

        {/* Logo and Brand Colors */}
        {hasBranding && (
          <div className="mt-4 space-y-3">
            {hasLogo && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Brand Logo</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                  ✓ Logo detected — will be applied to your portal
                </span>
              </div>
            )}
            {brandColors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Brand Colors</p>
                <div className="flex gap-3">
                  {brandColors.slice(0, 5).map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="text-xs text-gray-600 font-mono">{color.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasBranding && (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs text-blue-700">
              💡 No branding found. You can add a logo and colors later in portal settings.
            </p>
          </div>
        )}
      </div>

      {/* Portal Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-3xl font-bold text-teak">{result.products_created}</p>
          <p className="mt-1 text-xs font-medium text-gray-600 uppercase tracking-wide">Products Created</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-3xl font-bold text-gray-900">{result.categories_created.length}</p>
          <p className="mt-1 text-xs font-medium text-gray-600 uppercase tracking-wide">Categories</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:col-span-1">
          <a
            href={result.portal_url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-bold text-teak hover:underline line-clamp-1"
          >
            📍
          </a>
          <p className="mt-1 text-xs font-medium text-gray-600 uppercase tracking-wide">Live URL</p>
        </div>
      </div>

      {/* Categories */}
      {result.categories_created.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Categories Created</p>
          <div className="flex flex-wrap gap-2">
            {result.categories_created.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-teak-light/20 px-4 py-2 text-sm font-medium text-teak"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid Preview */}
      {!loadingProducts && products.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Products Preview</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition">
                <div className="aspect-square rounded-md bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                  {product.mockup_urls && product.mockup_urls.length > 0 ? (
                    <img
                      src={product.mockup_urls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><span class="text-xs text-gray-400">${product.category || 'Product'}</span></div>`; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-xs text-gray-400">{product.category || 'Product'}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                {product.category && (
                  <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                )}
                {product.pricing_tiers?.[0]?.unit_price != null && (
                  <p className="text-sm font-bold text-teak mt-2">${Number(product.pricing_tiers[0].unit_price).toFixed(2)}</p>
                )}
              </div>
            ))}
          </div>
          {products.length > 6 && (
            <p className="mt-3 text-center text-xs text-gray-500">
              +{products.length - 6} more products
            </p>
          )}
        </div>
      )}

      {/* Agent Summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">AI Agent Summary</p>
        <p className="text-sm text-gray-700 leading-relaxed">{result.agent_summary}</p>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">⚠️ Notes</p>
          <ul className="space-y-1">
            {result.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-amber-700 flex gap-2">
                <span className="text-xs mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Capability Gaps */}
      {result.capability_gaps.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">💡 Potential Enhancements</p>
          <p className="text-sm text-blue-700 mb-2">The agents identified these potential capabilities you could offer:</p>
          <ul className="space-y-1">
            {result.capability_gaps.map((gap, i) => (
              <li key={i} className="text-sm text-blue-700 flex gap-2">
                <span className="text-xs mt-0.5">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row border-t pt-6">
        {/* View Live Store */}
        <a
          href={result.portal_url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teak to-teak-dark px-6 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          <span>🌐</span>
          View Live Store
        </a>

        {/* Edit Products */}
        <button
          type="button"
          onClick={() => navigate(`/portals/${result.portal_id}`)}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-teak bg-white px-6 py-3 text-base font-semibold text-teak transition hover:bg-teak-light/5"
        >
          <span>✏️</span>
          Edit Products & Details
        </button>

        {/* Create Another */}
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <span>➕</span>
            Create Another
          </button>
        )}
      </div>
    </form>
  );
}
