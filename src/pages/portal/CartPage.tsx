import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePortalContext } from '../../contexts/PortalContext';
import Spinner from '../../components/ui/Spinner';
import { INVOICE_TERMS, FREIGHT_NOTE } from '../../lib/paymentTerms';
import { packPriceLabel, packQuantityLabel } from '../../lib/pricing';
import ArtworkDeclaration from '../../components/portal/ArtworkDeclaration';

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const { portal, products } = usePortalContext();
  const { cart, loading, updateItem, removeItem } = useCart();
  const productName = (productId: string) =>
    products.find((p) => p.id === productId)?.name ?? 'Product';
  const needsProof = (productId: string) =>
    products.find((p) => p.id === productId)?.proof_required === true;

  const primaryColor = portal?.brand_config?.primary_color || '#558B2F';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Browse products and add items to your cart.
        </p>
        <Link
          to={`/p/${slug}/products`}
          className="mt-4 inline-block rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Invoice-terms portals show no freight charge: it is billed at cost later.
  const shippingCost = INVOICE_TERMS ? 0 : 9.99;
  const total = cart.subtotal + shippingCost;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="mt-6 space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border bg-white p-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {productName(item.product_id)}
              </p>
              <div className="mt-1 flex gap-3 text-xs text-gray-500">
                {item.price_option && <span>{item.price_option}</span>}
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {packPriceLabel(item.unit_price, item.pack_size ?? 1)}
              </p>
              {(item.pack_size ?? 1) > 1 && (
                <p className="text-xs text-gray-500">
                  {packQuantityLabel(item.quantity, item.pack_size)}
                </p>
              )}
              {needsProof(item.product_id) && (
                <ArtworkDeclaration
                  compact
                  idPrefix={`cart-${item.id}`}
                  value={{
                    disposition: item.artwork_disposition ?? null,
                    note: item.artwork_change_note ?? '',
                    uploadUrl: item.artwork_upload_url ?? null,
                  }}
                  onChange={(next) =>
                    updateItem(item.id, {
                      quantity: item.quantity,
                      artwork_disposition: next.disposition ?? undefined,
                      artwork_change_note: next.note,
                      artwork_upload_url: next.uploadUrl ?? undefined,
                    })
                  }
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateItem(item.id, { quantity: item.quantity - 1 })
                      : removeItem(item.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                  className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-medium text-gray-900">
                ${(Number(item.unit_price) * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 rounded-lg border bg-white p-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>{INVOICE_TERMS ? 'Freight' : 'Shipping'}</span>
          <span>{INVOICE_TERMS ? FREIGHT_NOTE : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="mt-2 border-t pt-2 flex justify-between font-medium text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          to={`/p/${slug}/products`}
          className="text-sm text-teak-dark hover:text-teak"
        >
          Continue Shopping
        </Link>
        <Link
          to={`/p/${slug}/checkout`}
          className="rounded-md px-6 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
