import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProduct } from '../../api/portals';
import { checkSafeOrder } from '../../api/orders';
import { createPortalQuote } from '../../api/quotes';
import { usePortalContext } from '../../contexts/PortalContext';
import { useCart } from '../../contexts/CartContext';
import { isAuthenticated } from '../../api/client';
import type { Product } from '../../types/product';
import Spinner from '../../components/ui/Spinner';

export default function PortalProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const { portal } = usePortalContext();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isSafeOrder, setIsSafeOrder] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quoteDesiredDate, setQuoteDesiredDate] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

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

  useEffect(() => {
    if (!slug || !product || !product.proof_required || !isAuthenticated()) {
      setIsSafeOrder(false);
      return;
    }
    checkSafeOrder(slug, product.id, selectedSize || undefined, selectedColor || undefined)
      .then((res) => setIsSafeOrder(res.is_safe_order))
      .catch(() => setIsSafeOrder(false));
  }, [slug, product?.id, product?.proof_required, selectedSize, selectedColor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!product || !portal) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900">Product Not Found</h2>
        <Link to={`/p/${slug}/products`} className="mt-2 text-sm text-teak-dark hover:text-teak">
          Back to catalog
        </Link>
      </div>
    );
  }

  const primaryColor = portal.brand_config?.primary_color || '#558B2F';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link to={`/p/${slug}/products`} className="text-sm text-teak-dark hover:text-teak">
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
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
            <div className="mt-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              {isSafeOrder && (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Safe Order
                </span>
              )}
            </div>
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
                          ${Number(tier.unit_price).toFixed(2)}
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

          {/* Quantity + Add to Cart */}
          {isAuthenticated() && product.pricing_tiers.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Qty</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(product.min_order_qty, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.min_order_qty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.min_order_qty, parseInt(e.target.value) || 1))}
                    className="w-16 rounded border border-gray-300 px-2 py-1.5 text-center text-sm"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (!product) return;
                  setAdding(true);
                  setAdded(false);
                  try {
                    const unitPrice = product.pricing_tiers[0].unit_price;
                    await addItem({
                      product_id: product.id,
                      quantity,
                      size: selectedSize || undefined,
                      color: selectedColor || undefined,
                      unit_price: unitPrice,
                    });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                  } catch {
                    // error handled by cart context
                  } finally {
                    setAdding(false);
                  }
                }}
                disabled={adding}
                className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: added ? '#16a34a' : primaryColor }}
              >
                {adding ? 'Adding...' : added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Request a Quote
              </button>
            </div>
          )}

          {/* Request a Quote — available even without pricing tiers */}
          {isAuthenticated() && product.pricing_tiers.length === 0 && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Request a Quote
              </button>
            </div>
          )}

          {/* Quote Request Modal */}
          {showQuoteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900">Request a Quote</h3>
                <p className="mt-1 text-sm text-gray-500">
                  for {product.name} — Qty: {quantity}
                  {selectedSize ? `, Size: ${selectedSize}` : ''}
                  {selectedColor ? `, Color: ${selectedColor}` : ''}
                </p>

                {quoteSubmitted ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-green-700">
                      Quote request submitted! We&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => { setShowQuoteModal(false); setQuoteSubmitted(false); }}
                      className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!slug) return;
                      setQuoteSubmitting(true);
                      try {
                        await createPortalQuote(slug, {
                          description: quoteDescription || `Quote for ${product.name}`,
                          product_id: product.id,
                          quantity,
                          desired_date: quoteDesiredDate || undefined,
                        });
                        setQuoteSubmitted(true);
                        setQuoteDescription('');
                        setQuoteDesiredDate('');
                      } catch {
                        // best-effort
                      } finally {
                        setQuoteSubmitting(false);
                      }
                    }}
                    className="mt-4 space-y-3"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional details
                      </label>
                      <textarea
                        value={quoteDescription}
                        onChange={(e) => setQuoteDescription(e.target.value)}
                        rows={3}
                        placeholder="Any special requirements..."
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Desired delivery date
                      </label>
                      <input
                        type="date"
                        value={quoteDesiredDate}
                        onChange={(e) => setQuoteDesiredDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowQuoteModal(false)}
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={quoteSubmitting}
                        className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {quoteSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
