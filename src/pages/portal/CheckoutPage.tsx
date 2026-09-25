import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { usePortalContext } from "../../contexts/PortalContext";
import { createPaymentIntent, confirmCheckout } from "../../api/checkout";
import { createPortalOrder, listMyOrders } from "../../api/orders";
import { COUNTRIES } from "../../lib/labels";
import { getShippingRates } from "../../api/shipping";
import type { ShippingAddress } from "../../types/order";
import type { ShippingRate } from "../../types/shipping";
import { INVOICE_TERMS, FREIGHT_NOTE } from "../../lib/paymentTerms";
import StripePaymentForm from "../../components/checkout/StripePaymentForm";
import Spinner from "../../components/ui/Spinner";

// S84 / plan §5.5 — Phase 1 hardcode: every RGI portal is invoice-terms, so the
// checkout places the order for later invoicing and never shows a payment step.
// Phase 2 generalises this as a per-portal `payment_mode` (invoice | card) read
// from the public portal response; the card path below is kept for that.
export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { portal, products } = usePortalContext();
  const { cart } = useCart();
  const productName = (productId: string) =>
    products.find((p) => p.id === productId)?.name ?? "Product";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    name: portal?.name ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    attention: "",
    phone: "",
  });
  // S85 item 8: the front desk confirms the hotel's address rather than
  // retyping it. Prefilled from the buyer's most recent order in this portal;
  // the ship-to name defaults to the portal (the hotel) itself.
  const [prefilledFrom, setPrefilledFrom] = useState<string | null>(null);
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    listMyOrders(slug)
      .then((orders) => {
        if (cancelled || orders.length === 0) return;
        const latest = [...orders].sort((a, b) => (a.placed_at < b.placed_at ? 1 : -1))[0];
        const prior = latest.shipping_address;
        setAddress((current) => ({
          ...current,
          name: prior.name || current.name,
          line1: prior.line1,
          line2: prior.line2 ?? "",
          city: prior.city,
          state: prior.state,
          postal_code: prior.postal_code,
          country: prior.country || "US",
          attention: prior.attention ?? "",
          phone: prior.phone ?? "",
        }));
        setPrefilledFrom(latest.order_number);
      })
      .catch(() => {
        /* no history: the form stays as the portal default */
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  useEffect(() => {
    if (portal?.name) setAddress((current) => (current.name ? current : { ...current, name: portal.name }));
  }, [portal?.name]);
  const [poNumber, setPoNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Shipping rates state
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);

  // Stripe payment state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const primaryColor = portal?.brand_config?.primary_color || "#558B2F";
  // S84: per-portal purchase-order requirement. A number or a name — invoicing
  // bills from it ("a PO number or name"), so the field is text, never numeric.
  const requirePo = Boolean(portal?.require_po);
  const poMissing = requirePo && poNumber.trim() === "";

  // Fetch shipping rates when address is sufficiently filled
  useEffect(() => {
    // Invoice terms: freight is billed at cost later, so no rate is quoted.
    if (INVOICE_TERMS) return;
    if (!address.city || !address.state || !address.postal_code) {
      return;
    }

    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const rates = await getShippingRates({
          from_address: {
            street1: "123 Print Shop Ave",
            city: "Springfield",
            state: "IL",
            zip: "62701",
            country: "US",
          },
          to_address: {
            street1: address.line1 || "123 Main St",
            city: address.city,
            state: address.state,
            zip: address.postal_code,
            country: address.country || "US",
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
  }, [
    address.city,
    address.state,
    address.postal_code,
    address.line1,
    address.country,
  ]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  const shippingCost = INVOICE_TERMS
    ? 0
    : selectedRate
      ? parseFloat(selectedRate.cost)
      : 9.99;
  const taxAmount = cart.subtotal * 0.0; // Tax calculated server-side on order creation
  const total = cart.subtotal + shippingCost + taxAmount;

  const placeInvoiceOrder = async () => {
    if (!slug || !cart) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await createPortalOrder(slug, {
        cart_id: cart.id,
        shipping_address: address,
        payment_method: "invoice",
        po_number: poNumber.trim() || undefined,
        notes: notes || undefined,
      });
      navigate(`/p/${slug}/orders/${order.id}/confirmation`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not place the order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !cart) return;

    if (poMissing) {
      setError(
        "This portal requires a purchase-order number or reference on every order.",
      );
      return;
    }

    if (INVOICE_TERMS) {
      await placeInvoiceOrder();
      return;
    }

    setCreatingIntent(true);
    setError(null);

    try {
      const response = await createPaymentIntent(slug, { cart_id: cart.id });
      setClientSecret(response.client_secret);
      setShowPayment(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize payment",
      );
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
        payment_method: "stripe",
        po_number: poNumber || undefined,
        notes: notes || undefined,
      });
      navigate(`/p/${slug}/orders/${order.id}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
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
          <h2 className="text-lg font-semibold text-gray-900">
            Ship to
          </h2>
          <p className="text-sm text-gray-500">
            {prefilledFrom
              ? `Filled in from your last order (${prefilledFrom}). Check it and change anything that differs.`
              : "Where the parcel goes and who should receive it."}
          </p>

          <form onSubmit={handleProceedToPayment} id="address-form">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="ship-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hotel or business name
                </label>
                <input
                  id="ship-name"
                  type="text"
                  required
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ship-attention"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Attention (who receives it)
                  </label>
                  <input
                    id="ship-attention"
                    type="text"
                    value={address.attention || ""}
                    onChange={(e) =>
                      setAddress({ ...address, attention: e.target.value })
                    }
                    placeholder="e.g. Front desk manager"
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ship-phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    id="ship-phone"
                    type="tel"
                    value={address.phone || ""}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    placeholder="For the carrier"
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="ship-line1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1
                </label>
                <input
                  id="ship-line1"
                  type="text"
                  required
                  value={address.line1}
                  onChange={(e) =>
                    setAddress({ ...address, line1: e.target.value })
                  }
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="ship-line2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>
                <input
                  id="ship-line2"
                  type="text"
                  value={address.line2 || ""}
                  onChange={(e) =>
                    setAddress({ ...address, line2: e.target.value })
                  }
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ship-city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    id="ship-city"
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ship-state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    id="ship-state"
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ship-zip"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code
                  </label>
                  <input
                    id="ship-zip"
                    type="text"
                    required
                    value={address.postal_code}
                    onChange={(e) =>
                      setAddress({ ...address, postal_code: e.target.value })
                    }
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ship-country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="ship-country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    disabled={showPayment}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {INVOICE_TERMS ? "Freight" : "Shipping Method"}
              </h2>
              {INVOICE_TERMS ? (
                <p className="mt-2 text-sm text-gray-600">
                  Shipped on the printer's carrier account. {FREIGHT_NOTE}; no
                  freight is charged here.
                </p>
              ) : loadingRates ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Spinner className="h-4 w-4 text-teak-dark" /> Fetching
                  shipping rates...
                </div>
              ) : shippingRates.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {shippingRates.map((rate) => (
                    <label
                      key={rate.rate_id}
                      className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm ${
                        selectedRate?.rate_id === rate.rate_id
                          ? "border-teak bg-teak/10"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_rate"
                          checked={selectedRate?.rate_id === rate.rate_id}
                          onChange={() => setSelectedRate(rate)}
                          disabled={showPayment}
                          className="h-4 w-4 text-teak-dark"
                        />
                        <div>
                          <span className="font-medium text-gray-900">
                            {rate.carrier} - {rate.service}
                          </span>
                          {rate.estimated_days && (
                            <span className="ml-2 text-gray-500">
                              ({rate.estimated_days} day
                              {rate.estimated_days !== 1 ? "s" : ""})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">
                        ${parseFloat(rate.cost).toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Standard shipping: $9.99
                  {address.city && " (enter full address for live rates)"}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="po-number"
                  className="block text-sm font-medium text-gray-900"
                >
                  PO number or reference
                  {requirePo && (
                    <span className="text-red-600"> (required)</span>
                  )}
                </label>
                <p className="mt-0.5 text-xs text-gray-600">
                  Most hotels need this on their invoice. A PO number or a name
                  both work.
                </p>
                <input
                  id="po-number"
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  required={requirePo}
                  aria-required={requirePo}
                  placeholder="e.g. 5118824933 or the name your accounts payable will recognise"
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="order-notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={showPayment}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            {INVOICE_TERMS && (
              <p className="mt-4 text-sm text-gray-700">
                You will be invoiced for this order. No payment is taken now.
              </p>
            )}

            {/* Show proceed button only if payment form is not yet visible */}
            {!showPayment && (
              <button
                type="submit"
                disabled={creatingIntent || submitting}
                className="mt-6 w-full rounded-md px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4 text-white" /> Placing order...
                  </span>
                ) : creatingIntent ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4 text-white" /> Preparing
                    payment...
                  </span>
                ) : INVOICE_TERMS ? (
                  "Place order — to be invoiced"
                ) : (
                  "Continue to Payment"
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
                  className="text-sm text-teak-dark hover:text-teak"
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
                  <span className="font-medium text-gray-900">
                    {productName(item.product_id)}
                  </span>
                  {" "}
                  {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                  {item.size && ` (${item.size})`}
                  {item.color && ` - ${item.color}`}
                </span>
                <span className="font-medium">
                  ${(Number(item.unit_price) * item.quantity).toFixed(2)}
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
                  {INVOICE_TERMS ? "Freight" : "Shipping"}
                  {!INVOICE_TERMS && selectedRate && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({selectedRate.carrier} {selectedRate.service})
                    </span>
                  )}
                </span>
                <span>
                  {INVOICE_TERMS ? FREIGHT_NOTE : `$${shippingCost.toFixed(2)}`}
                </span>
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

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {submitting && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner className="h-4 w-4 text-teak-dark" /> Confirming order...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
