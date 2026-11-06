import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPrinterOrders } from '../../api/orders';
import { listBatches, listTaylorPool } from '../../api/production';
import ProductionLayout from '../../components/production/ProductionLayout';
import { ageSeconds, ageText, nextSort, receivedText, slotsFor, sortRows, type SortState } from '../../lib/production';
import type { Order } from '../../types/order';
import type { BatchSummary, TaylorPoolLine } from '../../types/production';

/** Board 1: every line from every channel in one list, the moment it is
 * placed. Rows come from the RGI portal's orders and the Taylor pool; PageDNA
 * and email have no source yet and are said so. */

export interface OrderRow {
  id: string;
  received: string; // ISO
  age: number; // seconds since the customer placed it
  channel: 'Taylor' | 'RGI portal' | 'PageDNA' | 'Email';
  order: string;
  line: string;
  product: string;
  qty: number;
  pack: number;
  slots: number;
  stock: string;
  status: string;
  statusKind: 'placed' | 'unbatched' | 'held' | 'waiting' | 'released';
  batch: number | null;
  batchUnitId: string | null;
}

type SortKey = keyof Pick<OrderRow, 'received' | 'age' | 'channel' | 'order' | 'product' | 'slots' | 'stock' | 'status' | 'batch'>;

const HEADERS: { key: SortKey | null; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'age', label: 'Age' },
  { key: 'channel', label: 'Channel' },
  { key: 'order', label: 'Order' },
  { key: null, label: 'Line' },
  { key: 'product', label: 'Product' },
  { key: null, label: 'Qty × pack' },
  { key: 'slots', label: 'Slots' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
  { key: 'batch', label: 'Batch' },
];

const CHANNEL_PILL: Record<OrderRow['channel'], { background: string; color: string }> = {
  Taylor: { background: '#e3eefb', color: '#1d4e89' },
  PageDNA: { background: '#efe9fb', color: '#5b3aa6' },
  'RGI portal': { background: '#e6f3ee', color: '#558b2f' },
  Email: { background: '#f3efe5', color: '#7a5a12' },
};
const STATUS_PILL: Record<OrderRow['statusKind'], { background: string; color: string }> = {
  placed: { background: '#e6f3ee', color: '#558b2f' },
  held: { background: '#fdebe6', color: '#a3331d' },
  waiting: { background: '#fbf1d9', color: '#7a5a12' },
  unbatched: { background: '#fbf1d9', color: '#7a5a12' },
  released: { background: '#e9ebef', color: '#3f4854' },
};

export function channelLabel(channel: string): OrderRow['channel'] {
  if (channel === 'taylor' || channel === 'press_run') return 'Taylor';
  if (channel === 'pagedna') return 'PageDNA';
  if (channel === 'email') return 'Email';
  return 'RGI portal';
}

export function rowsFromOrders(orders: Order[], batches: BatchSummary[], now: Date): OrderRow[] {
  // A line's batch is the production unit that lists it (the batches list carries the ids).
  const byLine = new Map<string, BatchSummary>();
  for (const b of batches) for (const id of b.line_item_ids ?? []) byLine.set(id, b);
  // A waiting line's stock is what the fill advice asserted for it (the spec library's value in force).
  const stockByLine = new Map<string, string>();
  for (const b of batches) for (const c of b.fill_candidates ?? []) for (const id of c.line_item_ids ?? []) stockByLine.set(id, c.stock);
  const rows: OrderRow[] = [];
  for (const order of orders) {
    for (const li of order.line_items) {
      const batch = byLine.get(li.id) ?? null;
      const production = batch ? { id: batch.unit_id, release_state: batch.release_state, ordinal: batch.batch_number } : null;
      const cards = li.quantity * (li.pack_size ?? 1);
      const held = (order.release_state ?? '') === 'held_for_proof';
      const released = production?.release_state === 'released';
      const status = released
        ? `Pushed out${batch?.docket_number ? ` · Docket ${batch.docket_number}` : ''}`
        : held
          ? 'Held · proof'
          : batch == null
            ? 'Waiting for a batch'
            : !batch.full
              ? `Waiting · batch ${batch.batch_number} at ${batch.used}/${batch.capacity}`
              : 'Placed';
      rows.push({
        id: li.id,
        received: order.placed_at,
        age: ageSeconds(order.placed_at, now),
        channel: 'RGI portal',
        order: order.po_number || order.order_number,
        line: String(order.line_items.indexOf(li) + 1),
        product: li.product_sku ? `${li.product_sku} · ${li.product_name}` : li.product_name,
        qty: li.quantity,
        pack: li.pack_size ?? 1,
        slots: slotsFor(cards),
        stock: batch?.stock || stockByLine.get(li.id) || '',
        status,
        statusKind: released ? 'released' : held ? 'held' : batch == null ? 'unbatched' : !batch.full ? 'waiting' : 'placed',
        batch: batch?.batch_number ?? production?.ordinal ?? null,
        batchUnitId: production?.id ?? null,
      });
    }
  }
  return rows;
}

export function rowsFromTaylor(lines: TaylorPoolLine[], now: Date): OrderRow[] {
  return lines.map((l) => ({
    id: l.id,
    received: l.received_at,
    age: ageSeconds(l.source_created_at, now),
    channel: 'Taylor',
    order: l.po,
    line: String(l.line_no),
    product: l.product,
    qty: l.quantity,
    pack: l.pack,
    slots: slotsFor(l.cards),
    stock: l.stock || '',
    status: l.art_state === 'hold' ? `Held · art: ${l.art_error ?? 'missing'}` : 'Waiting for a batch',
    statusKind: l.art_state === 'hold' ? 'held' : 'unbatched',
    batch: null,
    batchUnitId: null,
  }));
}

export default function AllChannelOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [taylor, setTaylor] = useState<TaylorPoolLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'received', direction: 'desc' });
  const [channel, setChannel] = useState('All');
  const [show, setShow] = useState('Waiting and held');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([listPrinterOrders(), listBatches(), listTaylorPool().catch(() => [] as TaylorPoolLine[])])
      .then(([o, b, t]) => {
        setOrders(o);
        setBatches(b);
        setTaylor(t);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the orders'));
  }, []);

  const now = useMemo(() => new Date(), [orders, taylor]);
  const all = useMemo(() => [...rowsFromOrders(orders, batches, now), ...rowsFromTaylor(taylor, now)], [orders, batches, taylor, now]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((r) => {
      if (channel !== 'All' && r.channel !== channel) return false;
      if (show === 'Waiting and held' && r.statusKind === 'released') return false;
      if (show === 'In an open batch' && !(r.batch && r.statusKind !== 'released')) return false;
      if (show === 'Pushed out' && r.statusKind !== 'released') return false;
      if (q && ![r.order, r.product, r.stock, r.status].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [all, channel, show, search]);
  const rows = useMemo(() => sortRows(filtered, sort.key, sort.direction), [filtered, sort]);

  const waiting = all.filter((r) => r.statusKind === 'unbatched').length;
  const waitingOld = all.filter((r) => r.statusKind === 'unbatched' && r.age > 2 * 86400).length;
  const inOpen = all.filter((r) => r.batch != null && r.statusKind !== 'released').length;
  const openBatches = batches.filter((b) => b.release_state == null && !b.cancelled);
  const held = all.filter((r) => r.statusKind === 'held').length;
  const oldest = all.reduce((m, r) => Math.max(m, r.age), 0);
  const channels = new Set(all.map((r) => r.channel)).size;

  return (
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>All Channel Orders</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {all.length} lines · from {channels} channel{channels === 1 ? '' : 's'} · oldest {ageText(oldest)}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#4b5563' }}>Lines arrive as orders are placed. Nothing here is a weekly pull.</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          Channel
          <select value={channel} onChange={(e) => setChannel(e.target.value)} style={selectStyle}>
            {['All', 'Taylor', 'PageDNA', 'RGI portal', 'Email'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          Show
          <select value={show} onChange={(e) => setShow(e.target.value)} style={selectStyle}>
            {['Waiting and held', 'In an open batch', 'Pushed out', 'Everything'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, flex: '1 1 220px' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Search</span>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="PO, product, any field" style={{ ...selectStyle, flex: 1 }} />
        </label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <Tile label="Waiting for a batch" value={String(waiting)} note={`${waitingOld} older than 2 days`} />
        <Tile label="In open batches" value={String(inOpen)} note={`${openBatches.length} batches, ${openBatches.filter((b) => b.full).length} full`} />
        <Tile label="Held" value={String(held)} note={held ? 'waiting on you' : 'nothing held'} color={held ? '#a3331d' : undefined} />
        <Tile label="Order → received" value={taylor.length ? 'minutes' : '—'} note="was 3.5 days by weekly pull" />
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      <div style={{ background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h.label} style={thStyle} aria-sort={h.key && sort.key === h.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {h.key ? (
                    <button
                      type="button"
                      onClick={() => setSort((s) => nextSort(s, h.key as SortKey, ['received']))}
                      style={{ all: 'unset', cursor: 'pointer', font: 'inherit', color: sort.key === h.key ? '#558b2f' : 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', padding: '4px 0', minHeight: 24 }}
                    >
                      {h.label}
                      {sort.key === h.key ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                    </button>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={r.statusKind === 'held' ? { background: '#fff8f6' } : undefined}>
                <td style={{ ...tdStyle, ...mono }}>{receivedText(r.received)}</td>
                <td style={{ ...tdStyle, ...(r.age > 2 * 86400 ? { color: '#a3331d', fontWeight: 600 } : {}) }}>{ageText(r.age)}</td>
                <td style={tdStyle}>
                  <span style={{ ...pill, ...CHANNEL_PILL[r.channel] }}>{r.channel}</span>
                </td>
                <td style={{ ...tdStyle, ...mono }}>{r.order}</td>
                <td style={{ ...tdStyle, ...mono }}>{r.line}</td>
                <td style={tdStyle}>{r.product}</td>
                <td style={{ ...tdStyle, ...mono }}>
                  {r.qty} × {r.pack}
                </td>
                <td style={{ ...tdStyle, ...mono }}>{r.slots}</td>
                <td style={{ ...tdStyle, ...(r.stock ? {} : { color: '#a3331d' }) }}>{r.stock || 'unknown'}</td>
                <td style={tdStyle}>
                  <span style={{ ...pill, ...STATUS_PILL[r.statusKind] }}>{r.status}</span>
                </td>
                <td style={tdStyle}>
                  {r.batch != null ? (
                    <Link to="/production/batches" style={{ ...mono, color: '#558b2f' }}>
                      {r.batch}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#4b5563' }}>
        Every row is a line, whatever channel it came from. A line's slots are qty × pack ÷ 250. "Waiting" means its batch is open and not yet full; age counts from when the
        customer placed the order, not from when we received it. PageDNA and email lines have no source yet; the Taylor lines are the pool's.
      </div>
    </ProductionLayout>
  );
}

function Tile({ label, value, note, color }: { label: string; value: string; note: string; color?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4, color }}>{value}</div>
      <div style={{ fontSize: 13, color: '#4b5563' }}>{note}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: '7px 10px', border: '1px solid #c9cfd6', borderRadius: 6, background: '#fff', font: 'inherit', fontSize: 14 };
const thStyle: React.CSSProperties = { textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#4b5563', padding: '10px 12px', borderBottom: '1px solid #d9dde3', letterSpacing: '.02em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '11px 12px', borderBottom: '1px solid #e6e9ee', fontSize: 14, verticalAlign: 'top' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500, lineHeight: '18px' };
