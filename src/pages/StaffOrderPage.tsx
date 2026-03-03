import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import { listPortals } from '../api/portals';
import type { Portal } from '../types/portal';
import type { Product } from '../types/product';
import type { ShippingAddress, Order } from '../types/order';
import Spinner from '../components/ui/Spinner';

interface LineItemInput {
  product_id: string;
  quantity: number;
  size: string;
  color: string;
}

interface CreateOrderOnBehalfRequest {
  customer_email: string;
  portal_id: string;
  line_items: LineItemInput[];
  shipping_address: ShippingAddress;
  payment_method: string;
  po_number?: string;
  notes?: string;
}

export default function StaffOrderPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedPortalId, setSelectedPortalId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('invoice');
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  // Line items
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { product_id: '', quantity: 1, size: '', color: '' },
  ]);

  // Data
  const [portals, setPortals] = useState<Portal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingPortals, setLoadingPortals] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    listPortals()
      .then(setPortals)
      .catch(() => {})
      .finally(() => setLoadingPortals(false));
  }, []);

  useEffect(() => {
    if (!selectedPortalId) {
      setProducts([]);
      return;
    }
    setLoadingProducts(true);
    apiRequest<Product[]>(`/portals/${selectedPortalId}/products`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [selectedPortalId]);

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { product_id: '', quantity: 1, size: '', color: '' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItemInput, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const validLineItems = lineItems.filter((li) => li.product_id && li.quantity > 0);
    if (validLineItems.length === 0) {
      setError('Please add at least one product.');
      setSubmitting(false);
      return;
    }

    const payload: CreateOrderOnBehalfRequest = {
      customer_email: customerEmail,
      portal_id: selectedPortalId,
      line_items: validLineItems,
      shipping_address: address,
      payment_method: paymentMethod,
      po_number: poNumber || undefined,
      notes: notes || undefined,
    };

    try {
      const order = await apiRequest<Order>('/orders/on-behalf', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Create Order on Behalf of Customer</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Portal */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Customer & Portal</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Email</label>
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Portal</label>
            {loadingPortals ? (
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <Spinner className="h-4 w-4 text-indigo-600" /> Loading portals...
              </div>
            ) : (
              <select
                required
                value={selectedPortalId}
                onChange={(e) => setSelectedPortalId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a portal...</option>
                {portals.map((portal) => (
                  <option key={portal.id} value={portal.id}>
                    {portal.name} ({portal.slug})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Products</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              + Add Item
            </button>
          </div>

          {loadingProducts && selectedPortalId ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Spinner className="h-4 w-4 text-indigo-600" /> Loading products...
            </div>
          ) : !selectedPortalId ? (
            <p className="text-sm text-gray-500">Select a portal to see available products.</p>
          ) : (
            <div className="space-y-3">
              {lineItems.map((item, index) => {
                const selectedProduct = products.find((p) => p.id === item.product_id);
                return (
                  <div key={index} className="flex items-start gap-3 rounded-md border border-gray-200 p-3">
                    <div className="flex-1 grid gap-3 sm:grid-cols-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500">Product</label>
                        <select
                          value={item.product_id}
                          onChange={(e) => updateLineItem(index, 'product_id', e.target.value)}
                          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                        >
                          <option value="">Select...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.sku ? `(${p.sku})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        {selectedProduct && selectedProduct.sizes.length > 0 && (
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500">Size</label>
                            <select
                              value={item.size}
                              onChange={(e) => updateLineItem(index, 'size', e.target.value)}
                              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                            >
                              <option value="">-</option>
                              {selectedProduct.sizes.map((s) => (
                                <option key={s.label} value={s.label}>{s.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {selectedProduct && selectedProduct.colors.length > 0 && (
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500">Color</label>
                            <select
                              value={item.color}
                              onChange={(e) => updateLineItem(index, 'color', e.target.value)}
                              className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                            >
                              <option value="">-</option>
                              {selectedProduct.colors.map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="mt-5 shrink-0 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
            <input
              type="text"
              value={address.line2 || ''}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className={inputClass}
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
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                required
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className={inputClass}
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
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment & Notes</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={inputClass}
            >
              <option value="invoice">Invoice</option>
              <option value="stripe">Stripe</option>
              <option value="po">Purchase Order</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PO Number (optional)</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4 text-white" /> Creating...
              </span>
            ) : (
              'Create Order'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
