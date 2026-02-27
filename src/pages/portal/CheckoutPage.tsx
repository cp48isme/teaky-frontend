import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePortalContext } from '../../contexts/PortalContext';
import { confirmCheckout } from '../../api/checkout';
import type { ShippingAddress } from '../../types/order';
import Spinner from '../../components/ui/Spinner';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { portal } = usePortalContext();
  const { cart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');

  const primaryColor = portal?.brand_config?.primary_color || '#4F46E5';

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const shippingCost = 9.99;
  const total = cart.subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !cart) return;

    setSubmitting(true);
    setError(null);

    try {
      // For now, skip Stripe payment flow and confirm directly
      // In production, you'd create a PaymentIntent first
      const order = await confirmCheckout(slug, {
        cart_id: cart.id,
        payment_intent_id: 'pi_placeholder', // Would come from Stripe Elements
        shipping_address: address,
        payment_method: 'stripe',
        po_number: poNumber || undefined,
        notes: notes || undefined,
      });
      navigate(`/p/${slug}/orders/${order.id}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Shipping Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
            <input
              type="text"
              value={address.line2 || ''}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                required
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                required
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PO Number (optional)</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

          <div className="mt-4 rounded-lg border bg-white p-4 space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x ${item.unit_price.toFixed(2)}
                  {item.size && ` (${item.size})`}
                  {item.color && ` - ${item.color}`}
                </span>
                <span className="font-medium">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-1 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4 text-white" /> Processing...
              </span>
            ) : (
              `Place Order - $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
