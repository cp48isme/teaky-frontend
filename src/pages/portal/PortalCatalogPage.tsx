import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePortalContext } from '../../contexts/PortalContext';
import { humanize } from '../../lib/labels';

export default function PortalCatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { portal, products } = usePortalContext();
  const [categoryFilter, setCategoryFilter] = useState('');

  if (!portal) return null;

  const primaryColor = portal.brand_config?.primary_color || '#558B2F';
  // Chips are the categories this portal's products actually carry, in
  // catalog order, humanised. A portal with one category shows no chips.
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c))),
  ).map((value) => ({ value, label: humanize(value) }));
  const chips = categories.length > 1 ? [{ value: '', label: 'All' }, ...categories] : [];
  const filtered = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900">Products</h1>

      {/* Category Filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              categoryFilter === cat.value
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={
              categoryFilter === cat.value
                ? { backgroundColor: primaryColor }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">No products in this category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/p/${slug}/products/${product.id}`}
              className="block rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.mockup_urls.length > 0 ? (
                <img
                  src={product.mockup_urls[0]}
                  alt={product.name}
                  className="h-44 w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.querySelector('.img-fallback')?.classList.remove('hidden'); }}
                />
              ) : null}
              <div className={`h-44 w-full bg-gray-100 flex items-center justify-center img-fallback ${product.mockup_urls.length > 0 ? 'hidden' : ''}`}>
                <span className="text-sm text-gray-400">{humanize(product.category) || 'Product'}</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-0.5 text-xs text-gray-500">{humanize(product.category)}</p>
                {product.pricing_tiers.length > 0 && (
                  <p className="mt-1 text-sm font-medium" style={{ color: primaryColor }}>
                    From ${Number(product.pricing_tiers[0].unit_price).toFixed(2)}
                  </p>
                )}
                {product.sizes.length > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {product.sizes.map((s) => s.label).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
