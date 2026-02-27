import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProduct } from '../../api/portals';
import { usePortalContext } from '../../contexts/PortalContext';
import type { Product } from '../../types/product';
import Spinner from '../../components/ui/Spinner';

export default function PortalProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const { portal } = usePortalContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !productId) return;
    getPublicProduct(slug, productId)
      .then((p) => {
        setProduct(p);
        if (p.sizes.length > 0) setSelectedSize(p.sizes[0].label);
        if (p.colors.length > 0) setSelectedColor(p.colors[0].name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!product || !portal) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900">Product Not Found</h2>
        <Link to={`/p/${slug}/products`} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
          Back to catalog
        </Link>
      </div>
    );
  }

  const primaryColor = portal.brand_config?.primary_color || '#4F46E5';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to={`/p/${slug}/products`} className="text-sm text-indigo-600 hover:text-indigo-800">
        &larr; Back to products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          {product.mockup_urls.length > 0 ? (
            <div>
              <img
                src={product.mockup_urls[selectedImage]}
                alt={product.name}
                className="w-full rounded-lg border object-cover"
                style={{ maxHeight: '400px' }}
              />
              {product.mockup_urls.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.mockup_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 rounded border object-cover overflow-hidden ${
                        i === selectedImage ? 'ring-2' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={i === selectedImage ? { borderColor: primaryColor } : undefined}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border bg-gray-100">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">{product.category}</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>
            {product.sku && (
              <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedSize === size.label
                        ? 'text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={
                      selectedSize === size.label
                        ? { backgroundColor: primaryColor, borderColor: primaryColor }
                        : undefined
                    }
                  >
                    {size.label}
                    {size.price_adjustment > 0 && (
                      <span className="ml-1 text-xs opacity-75">+${size.price_adjustment.toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Color{selectedColor && `: ${selectedColor}`}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'ring-2 ring-offset-2'
                        : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: color.hex_code || '#ccc',
                      borderColor: selectedColor === color.name ? primaryColor : '#d1d5db',
                      ...(selectedColor === color.name ? { ringColor: primaryColor } : {}),
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pricing Tiers */}
          {product.pricing_tiers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Pricing</h3>
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.pricing_tiers.map((tier, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-gray-700">
                          {tier.min_qty}{tier.max_qty ? `\u2013${tier.max_qty}` : '+'}
                        </td>
                        <td className="px-4 py-2 text-right font-medium" style={{ color: primaryColor }}>
                          ${tier.unit_price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Min Order */}
          <p className="text-xs text-gray-500">
            Minimum order quantity: {product.min_order_qty}
          </p>
        </div>
      </div>
    </div>
  );
}
