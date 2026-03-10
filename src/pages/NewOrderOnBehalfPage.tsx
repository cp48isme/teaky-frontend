import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPortals } from '../api/portals';
import { listProducts } from '../api/products';
import { createOrderOnBehalf } from '../api/orders';
import type { Portal } from '../types/portal';
import type { Product } from '../types/product';
import type { ShippingAddress, OnBehalfLineItem } from '../types/order';
import Spinner from '../components/ui/Spinner';

export default function NewOrderOnBehalfPage() {
  const navigate = useNavigate();
  const [portals, setPortals] = useState<Portal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [portalId, setPortalId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OnBehalfLineItem[]>([
    { product_id: '', quantity: 1 },
  ]);
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState<'invoice_later' | 'stripe'>(
    'invoice_later',
  );
  const [poNumber, setPoNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    listPortals()
      .then(setPortals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (portalId) {
      listProducts(portalId)
        .then(setProducts)
        .catch(() => setProducts([]));
    }
  }, [portalId]);

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OnBehalfLineItem, value: string | number) => {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!portalId || !customerId || items.some((i) => !i.product_id)) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrderOnBehalf({
        portal_id: portalId,
        customer_id: customerId,
        items,
        shipping_address: address,
        payment_method: paymentMethod,
        po_number: poNumber || undefined,
        notes: notes || undefined,
      });
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="font-heading text-xl font-bold text-brand-dark">New Order on Behalf</h2>
      <p className="text-sm text-gray-500">Create an order on behalf of a customer.</p>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Portal & Customer */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Order Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Portal</label>
              <select
                value={portalId}
                onChange={(e) => setPortalId(e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              >
                <option value="">Select portal...</option>
                {portals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer ID</label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="User UUID"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-teak-dark hover:text-teak"
            >
              + Add Item
            </button>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-end gap-3 border-b pb-3 last:border-0">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500">Product</label>
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(idx, 'product_id', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  required
                >
                  <option value="">Select...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.sku ? `(${p.sku})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500">Size</label>
                <input
                  type="text"
                  value={item.size || ''}
                  onChange={(e) => updateItem(idx, 'size', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  placeholder="Optional"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500">Color</label>
                <input
                  type="text"
                  value={item.color || ''}
                  onChange={(e) => updateItem(idx, 'color', e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                  placeholder="Optional"
                />
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-red-500 hover:text-red-700 text-sm pb-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Shipping Address</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                placeholder="Recipient Name"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                placeholder="Address Line 1"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="City"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <input
                type="text"
                value={address.postal_code}
                onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                placeholder="ZIP"
                className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment & Notes */}
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Payment & Notes</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'invoice_later'}
                    onChange={() => setPaymentMethod('invoice_later')}
                  />
                  <span className="text-sm">Invoice Later</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                  />
                  <span className="text-sm">Collect Payment Now</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PO Number</label>
              <input
                type="text"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder="Optional"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this order..."
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
