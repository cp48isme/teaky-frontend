import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createOrderOnBehalf, getPrinterOrder } from '../api/orders';
import { listPortals } from '../api/portals';
import { listProducts } from '../api/products';
import type { CreateOrderOnBehalfRequest, Order, OrderContact, ShippingAddress } from '../types/order';
import type { Portal } from '../types/portal';
import type { Product } from '../types/product';

/** Canvas board 6 — order entry, one system, reorder (day 5, 7 Nov 2026,
 * Part C) on the widened on-behalf path (#198): who / what / when, the
 * three people as three fields, "+ lead time" and "+ bill-to" revealed on a
 * press, a Teaky number on save, reorder from a past order with the price
 * last time beside the catalogue's now — and needed-by never copied. */

type HowItCameIn = 'email' | 'phone' | 'text' | 'portal';
type BillTo = 'property' | 'management_company' | 'card_on_file';

interface Line {
  product_id: string;
  quantity: number;
  proof_required: boolean;
  /** On a reorder: the price the line was placed at last time (per pack). */
  last_price: number | null;
  show_lead_time: boolean;
}

const emptyContact = (): OrderContact => ({ name: '', title: '', email: '', phone: '' });
const emptyAddress = (): ShippingAddress => ({ name: '', attention: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US', phone: '' });
const newLine = (): Line => ({ product_id: '', quantity: 1, proof_required: false, last_price: null, show_lead_time: false });

export function priceNow(product: Product | undefined, quantity: number): number | null {
  if (!product) return null;
  const tiers = [...(product.pricing_tiers ?? [])].sort((a, b) => a.min_qty - b.min_qty);
  const tier = tiers.filter((t) => quantity >= t.min_qty && (t.max_qty == null || quantity <= t.max_qty)).pop();
  if (tier) return tier.unit_price;
  if (tiers.length) return tiers[tiers.length - 1].unit_price;
  return product.base_price ?? null;
}

export function money(value: number | null | undefined): string {
  return value == null ? '—' : `$${value.toFixed(2)}`;
}

function contactOf(source: OrderContact | null | undefined): OrderContact {
  return source ? { name: source.name ?? '', title: source.title ?? '', email: source.email ?? '', phone: source.phone ?? '' } : emptyContact();
}

function cleanContact(c: OrderContact): OrderContact | null {
  if (!c.name.trim()) return null;
  return { name: c.name.trim(), title: c.title?.trim() || null, email: c.email?.trim() || null, phone: c.phone?.trim() || null };
}

const field = 'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm';
const label = 'block text-sm font-medium text-gray-700';
const reveal = 'text-sm text-teak-dark underline underline-offset-2';

export default function OrderEntryPage() {
  const [params] = useSearchParams();
  const reorderOf = params.get('reorder');
  const [portals, setPortals] = useState<Portal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [portalId, setPortalId] = useState('');
  const [source, setSource] = useState<Order | null>(null);
  const [orderingContact, setOrderingContact] = useState<OrderContact>(emptyContact());
  const [howItCameIn, setHowItCameIn] = useState<HowItCameIn>('email');
  const [shipTo, setShipTo] = useState<ShippingAddress>(emptyAddress());
  const [forWhom, setForWhom] = useState<OrderContact>(emptyContact());
  const [showForWhom, setShowForWhom] = useState(false);
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [neededBy, setNeededBy] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [billTo, setBillTo] = useState<BillTo>('property');
  const [showBillTo, setShowBillTo] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPortals()
      .then(setPortals)
      .catch(() => setPortals([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!portalId) return;
    listProducts(portalId)
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [portalId]);

  // Reorder: everything below is editable; needed-by is never copied.
  useEffect(() => {
    if (!reorderOf) return;
    getPrinterOrder(reorderOf)
      .then((order) => {
        setSource(order);
        setPortalId(order.portal_id);
        setOrderingContact(contactOf(order.ordering_contact));
        if (order.for_whom) {
          setForWhom(contactOf(order.for_whom));
          setShowForWhom(true);
        }
        setShipTo({ ...emptyAddress(), ...order.shipping_address });
        setLines(
          order.line_items.map((li) => ({
            product_id: li.product_id,
            quantity: li.quantity,
            proof_required: false,
            last_price: li.unit_price,
            show_lead_time: false,
          })),
        );
        setNeededBy('');
        setPoNumber('');
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'The past order could not be read'));
  }, [reorderOf]);

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const portal = portals.find((p) => p.id === portalId);

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function request(): CreateOrderOnBehalfRequest {
    const came = { email: 'Came in by email', phone: 'Came in by phone', text: 'Came in by text', portal: 'Came in through the portal' }[howItCameIn];
    const bill = { property: 'Bill to: the property (terms, net 30)', management_company: 'Bill to: the management company', card_on_file: 'Bill to: card on file' }[billTo];
    const contact = cleanContact(orderingContact);
    return {
      portal_id: portalId,
      customer_email: contact?.email ?? undefined,
      customer_name: contact?.name ?? undefined,
      items: lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity, artwork_disposition: l.proof_required ? 'changes_new_proof' : 'reuse_unchanged' })),
      shipping_address: { ...shipTo, attention: shipTo.attention || undefined, phone: shipTo.phone || undefined, line2: shipTo.line2 || undefined },
      payment_method: billTo === 'card_on_file' ? 'stripe' : 'invoice_later',
      po_number: poNumber.trim() || undefined,
      needed_by: neededBy || null,
      channel: howItCameIn === 'portal' ? 'standard' : 'managed',
      ordering_contact: contact,
      for_whom: showForWhom ? cleanContact(forWhom) : null,
      reordered_from_order_id: reorderOf ?? null,
      notes: [came, bill, notes.trim()].filter(Boolean).join(' · '),
    };
  }

  async function save(startAnother: boolean) {
    setError('');
    if (!portalId || lines.some((l) => !l.product_id || l.quantity < 1) || !shipTo.name || !shipTo.line1 || !shipTo.city || !shipTo.state || !shipTo.postal_code) {
      setError('The property, a product and quantity on every line, and the ship-to are needed before Save.');
      return;
    }
    setSaving(true);
    try {
      const order = await createOrderOnBehalf(request());
      setSaved(order);
      if (startAnother) {
        setLines([newLine()]);
        setNeededBy('');
        setPoNumber('');
        setNotes('');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The order was refused');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="py-10 text-sm text-gray-500">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6" data-testid="order-entry">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="font-heading text-xl font-bold text-brand-dark">New order</h2>
        {source ? (
          <span className="text-sm text-gray-600" data-testid="reorder-of">
            Reorder of {source.po_number || source.order_number} · {new Date(source.placed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ) : null}
        <span className="ml-auto text-sm text-gray-500">Everything below is editable. Nothing is placed until you press Save.</span>
      </div>

      {saved ? (
        <div role="status" className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Saved. Teaky number <span className="font-mono font-semibold">{saved.order_number}</span> — a Docket order when its batch is pushed out, a QuickBooks Estimate per shipment carrying this number.{' '}
          <Link to={`/orders/${saved.id}`} className="underline">
            Open it
          </Link>
        </div>
      ) : null}
      {error ? (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Who */}
      <section className="space-y-4 rounded-lg border bg-white p-4" aria-labelledby="who">
        <h3 id="who" className="font-medium text-gray-900">
          Who
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="property">
              Property
            </label>
            <select id="property" value={portalId} onChange={(e) => setPortalId(e.target.value)} className={field}>
              <option value="">Choose the property…</option>
              {portals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {portal ? <div className="mt-1 text-xs text-gray-500">Property matched · {portal.slug}</div> : null}
          </div>
          <fieldset>
            <legend className={label}>How it came in</legend>
            <div className="mt-1 flex flex-wrap gap-3 text-sm">
              {(['email', 'phone', 'text', 'portal'] as HowItCameIn[]).map((h) => (
                <label key={h} className="flex items-center gap-1 capitalize">
                  <input type="radio" name="how" value={h} checked={howItCameIn === h} onChange={() => setHowItCameIn(h)} />
                  {h}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <div className={label}>Ordering contact</div>
          <div className="mt-1 grid gap-3 sm:grid-cols-4">
            <input aria-label="Contact name" value={orderingContact.name} onChange={(e) => setOrderingContact({ ...orderingContact, name: e.target.value })} placeholder="Name" className={field.replace('mt-1 ', '')} />
            <input aria-label="Contact title" value={orderingContact.title ?? ''} onChange={(e) => setOrderingContact({ ...orderingContact, title: e.target.value })} placeholder="Title" className={field.replace('mt-1 ', '')} />
            <input aria-label="Contact email" value={orderingContact.email ?? ''} onChange={(e) => setOrderingContact({ ...orderingContact, email: e.target.value })} placeholder="Email" className={field.replace('mt-1 ', '')} />
            <input aria-label="Contact phone" value={orderingContact.phone ?? ''} onChange={(e) => setOrderingContact({ ...orderingContact, phone: e.target.value })} placeholder="Phone" className={field.replace('mt-1 ', '')} />
          </div>
        </div>
        <div>
          <div className={label}>Ship to</div>
          <div className="mt-1 grid gap-3 sm:grid-cols-2">
            <input aria-label="Ship-to name" value={shipTo.name} onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })} placeholder="Property name" className={field.replace('mt-1 ', '')} />
            <input aria-label="Attention" value={shipTo.attention ?? ''} onChange={(e) => setShipTo({ ...shipTo, attention: e.target.value })} placeholder="Attn: Front desk" className={field.replace('mt-1 ', '')} />
            <input aria-label="Address line 1" value={shipTo.line1} onChange={(e) => setShipTo({ ...shipTo, line1: e.target.value })} placeholder="Street" className={`${field.replace('mt-1 ', '')} sm:col-span-2`} />
            <input aria-label="City" value={shipTo.city} onChange={(e) => setShipTo({ ...shipTo, city: e.target.value })} placeholder="City" className={field.replace('mt-1 ', '')} />
            <div className="grid grid-cols-2 gap-3">
              <input aria-label="State" value={shipTo.state} onChange={(e) => setShipTo({ ...shipTo, state: e.target.value })} placeholder="State" className={field.replace('mt-1 ', '')} />
              <input aria-label="Postal code" value={shipTo.postal_code} onChange={(e) => setShipTo({ ...shipTo, postal_code: e.target.value })} placeholder="ZIP" className={field.replace('mt-1 ', '')} />
            </div>
          </div>
        </div>
        <div>
          {showForWhom ? (
            <>
              <div className={label}>For (the name on the product, if any)</div>
              <div className="mt-1 grid gap-3 sm:grid-cols-4">
                <input aria-label="For name" value={forWhom.name} onChange={(e) => setForWhom({ ...forWhom, name: e.target.value })} placeholder="Name" className={field.replace('mt-1 ', '')} />
                <input aria-label="For title" value={forWhom.title ?? ''} onChange={(e) => setForWhom({ ...forWhom, title: e.target.value })} placeholder="Title" className={field.replace('mt-1 ', '')} />
                <input aria-label="For email" value={forWhom.email ?? ''} onChange={(e) => setForWhom({ ...forWhom, email: e.target.value })} placeholder="Email" className={field.replace('mt-1 ', '')} />
                <input aria-label="For phone" value={forWhom.phone ?? ''} onChange={(e) => setForWhom({ ...forWhom, phone: e.target.value })} placeholder="Phone" className={field.replace('mt-1 ', '')} />
              </div>
            </>
          ) : (
            <button type="button" className={reveal} onClick={() => setShowForWhom(true)}>
              + for (the name on the product)
            </button>
          )}
          <div className="mt-2 text-xs text-gray-500">The three people on an order are three fields — not one purchase-order box.</div>
        </div>
      </section>

      {/* What */}
      <section className="space-y-4 rounded-lg border bg-white p-4" aria-labelledby="what">
        <div className="flex items-baseline gap-3">
          <h3 id="what" className="font-medium text-gray-900">
            What
          </h3>
          {source ? <span className="text-xs text-gray-500">Copied from {source.po_number || source.order_number} — check quantity and price</span> : null}
        </div>
        {lines.map((line, index) => {
          const product = productById.get(line.product_id);
          const now = priceNow(product, line.quantity);
          return (
            <div key={index} className="space-y-2 rounded border border-gray-200 p-3" data-testid={`line-${index}`}>
              <div className="grid gap-3 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-500">Product</label>
                  <select aria-label={`Product ${index + 1}`} value={line.product_id} onChange={(e) => updateLine(index, { product_id: e.target.value })} className={field}>
                    <option value="">Choose…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                        {p.sku ? ` · ${p.sku}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Quantity</label>
                  <input aria-label={`Quantity ${index + 1}`} type="number" min={1} value={line.quantity} onChange={(e) => updateLine(index, { quantity: Math.max(1, Number(e.target.value) || 1) })} className={field} />
                </div>
                <div className="sm:col-span-2">
                  <div className="block text-xs font-medium text-gray-500">Price</div>
                  <div className="mt-1 text-sm" data-testid={`price-${index}`}>
                    {line.last_price != null ? (
                      <>
                        last time <span className="font-mono">{money(line.last_price)}</span> · catalogue now <span className="font-mono">{money(now)}</span>
                      </>
                    ) : (
                      <>
                        catalogue <span className="font-mono">{money(now)}</span>
                      </>
                    )}
                    {product?.pack_size && product.pack_size > 1 ? <span className="text-gray-500"> per pack of {product.pack_size}</span> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={line.proof_required} onChange={(e) => updateLine(index, { proof_required: e.target.checked })} />
                  Proof required before print
                </label>
                {line.show_lead_time ? (
                  <span className="text-gray-600" data-testid={`lead-time-${index}`}>
                    Lead time: {product?.lead_time_band ? product.lead_time_band.replace(/_/g, ' ') : 'not set on the product'}
                  </span>
                ) : (
                  <button type="button" className={reveal} onClick={() => updateLine(index, { show_lead_time: true })}>
                    + lead time
                  </button>
                )}
                {lines.length > 1 ? (
                  <button type="button" className="ml-auto text-sm text-red-600" onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}>
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
        <button type="button" className={reveal} onClick={() => setLines((prev) => [...prev, newLine()])}>
          + Add a line
        </button>
      </section>

      {/* When and how it bills */}
      <section className="space-y-4 rounded-lg border bg-white p-4" aria-labelledby="when">
        <h3 id="when" className="font-medium text-gray-900">
          When and how it bills
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="needed-by">
              Needed by
            </label>
            <input id="needed-by" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} className={field} />
            <div className="mt-1 text-xs text-gray-500">Never copied from a reorder.</div>
          </div>
          <div>
            <label className={label} htmlFor="po">
              Hotel's PO (if they gave one)
            </label>
            <input id="po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className={field} />
          </div>
        </div>
        <div>
          {showBillTo ? (
            <fieldset>
              <legend className={label}>Bill to</legend>
              <div className="mt-1 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="radio" name="bill" checked={billTo === 'property'} onChange={() => setBillTo('property')} /> Property (terms: net 30)
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="bill" checked={billTo === 'management_company'} onChange={() => setBillTo('management_company')} /> Management company
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="bill" checked={billTo === 'card_on_file'} onChange={() => setBillTo('card_on_file')} /> Card on file
                </label>
              </div>
            </fieldset>
          ) : (
            <button type="button" className={reveal} onClick={() => setShowBillTo(true)}>
              + bill-to (the property, net 30, unless you say otherwise)
            </button>
          )}
        </div>
        <div>
          <label className={label} htmlFor="notes">
            Notes
          </label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={field} placeholder="Spec, as you'd write it today" />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => save(false)} disabled={saving} className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white disabled:opacity-60" data-testid="save-order">
          Save order
        </button>
        <button type="button" onClick={() => save(true)} disabled={saving} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
          Save and start another for this property
        </button>
        <Link to="/orders" className="text-sm text-gray-500 underline">
          Discard
        </Link>
        <span className="ml-auto text-xs text-gray-500">On save: a Teaky number now, a Docket order when its batch is pushed out, a QuickBooks Estimate per shipment for Sue. No SnapForce step.</span>
      </div>
    </div>
  );
}
