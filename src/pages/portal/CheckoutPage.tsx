import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePortalContext } from '../../contexts/PortalContext';
import { createPaymentIntent, confirmCheckout } from '../../api/checkout';
import { getShippingRates } from '../../api/shipping';
import type { ShippingAddress } from '../../types/order';
import type { ShippingRate } from '../../types/shipping';
import StripePaymentForm from '../../components/checkout/StripePaymentForm';
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

  // Shipping rates state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  // Stripe payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const primaryColor = portal?.brand_config?.primary_color || '#4F46E5';

  // Fetch shipping rates when address is sufficiently filled
  useEffect(() => {
    if (!address.city || !address.state || !address.postal_code) {
      return;
    }

    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const rates = await getShippingRates({
          from_address: {
            street1: '123 Print Shop Ave',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
          to_address: {
            street1: address.line1 || '123 Main St',
            city: address.city,
            state: address.state,
            zip: address.postal_code,
            country: address.country || 'US',
          },
        });
        setShippingRates(rates);
        if (rates.length > 0 && !selectedRate) {
          setSelectedRate(rates[0]);
        }
      } catch {
        // Fall back to showing no rates (flat rate will apply)
        setShippingRates([]);
      } finally {
        setLoadingRates(false);
      }
    };

    const debounce = setTimeout(fetchRates, 500);
    return () => clearTimeout(debounce);
  }, [address.city, address.state, address.postal_code, address.line1, address.country]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const shippingCost = selectedRate ? parseFloat(selectedRate.cost) : 9.99;
  const taxAmount = cart.subtotal * 0.0; // Tax calculated server-side on order creation
  const total = cart.subtotal + shippingCost + taxAmount;

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !cart) return;

    setCreatingIntent(true);
    setError(null);

    try {
      const response = await createPaymentIntent(slug, { cart_id: cart.id });
      setClientSecret(response.client_secret);
      setShowPayment(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!slug || !cart) return;

    setSubmitting(true);
    setError(null);

    try {
      const order = await confirmCheckout(slug, {
        cart_id: cart.id,
        payment_intent_id: paymentIntentId,
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

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Shipping Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>

          <form onSubmit={handleProceedToPayment} id="address-form">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  value={address.line2 || ''}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
              {loadingRates ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Spinner className="h-4 w-4 text-indigo-600" /> Fetching shipping rates...
                </div>
              ) : shippingRates.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.rate_id}
                      className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm ${
                        selectedRate?.rate_id === rate.rate_id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_rate"
                          checked={selectedRate?.rate_id === rate.rate_id}
                          onChange={() => setSelectedRate(rate)}
                          disabled={showPayment}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            {rate.carrier} - {rate.service}
                          </span>
                          {rate.estimated_days && (
                            <span className="ml-2 text-gray-500">
                              ({rate.estimated_days} day{rate.estimated_days !== 1 ? 's' : ''})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">${parseFloat(rate.cost).toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Standard shipping: $9.99
                  {address.city && ' (enter full address for live rates)'}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">PO Number (optional)</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Show proceed button only if payment form is not yet visible */}
            {!showPayment && (
              <button
                type="submit"
                disabled={creatingIntent}
                className="mt-6 w-full rounded-md px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {creatingIntent ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4 text-white" /> Preparing payment...
                  </span>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            )}
          </form>

          {/* Stripe Payment Form */}
          {showPayment && clientSecret && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowPayment(false);
                    setClientSecret(null);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit address
                </button>
              </div>

              <StripePaymentForm
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                primaryColor={primaryColor}
              />
            </div>
          )}
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
                <span>
                  Shipping
                  {selectedRate && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({selectedRate.carrier} {selectedRate.service})
                    </span>
                  )}
                </span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-gray-900 pt-1 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          {submitting && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner className="h-4 w-4 text-indigo-600" /> Confirming order...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
