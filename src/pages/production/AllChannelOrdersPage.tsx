import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPrinterOrders, listShopTags, updateOrder } from '../../api/orders';
import { listBatches, listTaylorPool } from '../../api/production';
import ProductionSearch from '../../components/production/ProductionSearch';
import ProductionLayout from '../../components/production/ProductionLayout';
import { ageSeconds, ageText, nextSort, receivedText, slotsFor, sortRows, type SortState } from '../../lib/production';
import type { Order } from '../../types/order';
import type { BatchSummary, TaylorPoolLine } from '../../types/production';
import { isShadowReader } from '../../lib/roles';
import TagEditor from '../../components/production/TagEditor';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import { EMPTY_TAG_FILTER, cycleTag, passesTagFilter, tagFilterText, tagMode, tagUniverse, type TagFilter } from '../../lib/tags';

/** Board 1: every line from every channel in one list, the moment it is
 * placed. Rows come from the RGI portal's orders and the Taylor pool; PageDNA
 * and email have no source yet and are said so. */

export interface OrderRow {
  id: string;
  received: string; // ISO
  age: number; // seconds since the customer placed it
  channel: 'Taylor' | 'RGI portal' | 'PageDNA' | 'Email';
  /** t10 e (23 Nov 2026): the production lane — a press run, or stocked goods (pick and pack, never a press run). */
  lane: 'press_run' | 'stocked_goods';
  order: string;
  /** 20 Nov 2026: who the order is for — the Taylor grid's customer, the portal order's for_whom. */
  customer: string;
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
  /** The order the line belongs to (null for a raw Taylor line not yet written) — the whereabouts link's target. */
  orderId: string | null;
  /** The order's tags (Andrew, 17 Nov 2026): the include/exclude chips read these. */
  tags: string[];
}

type SortKey = keyof Pick<OrderRow, 'received' | 'age' | 'channel' | 'lane' | 'order' | 'customer' | 'product' | 'slots' | 'stock' | 'status' | 'batch'>;

const HEADERS: { key: SortKey | null; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'age', label: 'Age' },
  { key: 'channel', label: 'Channel' },
  { key: 'lane', label: 'Lane' },
  { key: 'order', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: null, label: 'Line' },
  { key: 'product', label: 'Product' },
  { key: null, label: 'Qty × pack' },
  { key: 'slots', label: 'Slots' },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Status' },
  { key: 'batch', label: 'Batch' },
];

const CHANNEL_PILL: Record<OrderRow['channel'], { background: string; color: string }> = {
  Taylor: { background: 'var(--sg-info-bg)', color: 'var(--sg-info)' },
  PageDNA: { background: 'var(--sg-accent2-bg)', color: 'var(--sg-accent2)' },
  'RGI portal': { background: 'var(--sg-ok-bg)', color: 'var(--sg-ok)' },
  Email: { background: 'var(--sg-paper-3)', color: 'var(--sg-warn)' },
};
const LANE_PILL: Record<OrderRow['lane'], { background: string; color: string; text: string }> = {
  press_run: { background: 'var(--sg-pill)', color: 'var(--sg-muted-2)', text: 'Press run' },
  stocked_goods: { background: 'var(--sg-ok-bg)', color: 'var(--sg-ok-2)', text: 'Stocked goods' },
};
const STATUS_PILL: Record<OrderRow['statusKind'], { background: string; color: string }> = {
  placed: { background: 'var(--sg-ok-bg)', color: 'var(--sg-ok)' },
  held: { background: 'var(--sg-danger-bg)', color: 'var(--sg-danger)' },
  waiting: { background: 'var(--sg-warn-bg)', color: 'var(--sg-warn)' },
  unbatched: { background: 'var(--sg-warn-bg)', color: 'var(--sg-warn)' },
  released: { background: 'var(--sg-pill)', color: 'var(--sg-muted-2)' },
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
        lane: 'press_run',
        order: order.po_number || order.order_number,
        customer: order.for_whom?.name ?? '',
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
        orderId: order.id,
        tags: order.tags ?? [],
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
    lane: l.lane === 'stocked_goods' ? 'stocked_goods' : 'press_run',
    order: l.po,
    customer: l.customer ?? '',
    line: String(l.line_no),
    product: l.product,
    qty: l.quantity,
    pack: l.pack,
    slots: slotsFor(l.cards),
    stock: l.stock || '',
    status:
      l.canonical_state === 'blocked'
        ? `Held · ${l.canonical_error ?? 'needs a person'}`
        : l.lane === 'stocked_goods'
          ? 'Stocked goods · pick and pack'
        : l.art_state === 'hold'
          ? `Held · art: ${l.art_error ?? 'missing'}`
          : 'Waiting for a batch',
    statusKind: l.canonical_state === 'blocked' || l.art_state === 'hold' ? 'held' : 'unbatched',
    batch: null,
    batchUnitId: null,
    orderId: null,
    tags: [],
  }));
}

export default function AllChannelOrdersPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [taylor, setTaylor] = useState<TaylorPoolLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [sort, setSort] = useState<SortState<SortKey>>({ key: 'received', direction: 'desc' });
  const [channel, setChannel] = useState('All');
  const [lane, setLane] = useState('All');
  const [show, setShow] = useState('Waiting and held');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<TagFilter>(EMPTY_TAG_FILTER);
  // Tags editing (t08, 19 Nov 2026): the shop's list for the pickers; a row's
  // tags are set inline, the whole list, and the order re-read from the answer.
  const [shopTags, setShopTags] = useState<string[]>([]);
  const [tagBusy, setTagBusy] = useState<string | null>(null);

  useEffect(() => {
    if (readOnly) return;
    listShopTags()
      .then((l) => setShopTags(l.tags))
      .catch(() => setShopTags([]));
  }, [readOnly]);

  async function setTags(orderId: string, tags: string[]) {
    setTagBusy(orderId);
    try {
      const updated = await updateOrder(orderId, { tags });
      setOrders((all) => all.map((o) => (o.id === updated.id ? updated : o)));
      setShopTags((s) => Array.from(new Set([...s, ...(updated.tags ?? [])])));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The tags were refused');
    } finally {
      setTagBusy(null);
    }
  }

  useEffect(() => {
    // A shadow_reader (dispatch 16 Nov 2026, item 5) reads the pool and the batches, not the orders list.
    Promise.all([readOnly ? Promise.resolve([] as Order[]) : listPrinterOrders(), listBatches(), listTaylorPool().catch(() => [] as TaylorPoolLine[])])
      .then(([o, b, t]) => {
        setOrders(o);
        setBatches(b);
        setTaylor(t);
      })
      .catch((e: unknown) => (isNoFloorRole(e) ? setNoRole(true) : setError(loadFailureText(e, 'Could not load the orders'))));
  }, [readOnly]);

  const now = useMemo(() => new Date(), [orders, taylor]);
  // One pool (9 Nov 2026): a Taylor PO is an order (channel 'taylor') whose
  // lines are pool lines, so every row comes from the orders; the raw Taylor
  // record is read only for the latency tile and for lines not yet written.
  const all = useMemo(
    () => [...rowsFromOrders(orders, batches, now), ...rowsFromTaylor(readOnly ? taylor : taylor.filter((l) => l.canonical_state !== 'written'), now)],
    [orders, batches, taylor, now, readOnly],
  );
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((r) => {
      if (channel !== 'All' && r.channel !== channel) return false;
      if (lane === 'Stocked goods' && r.lane !== 'stocked_goods') return false;
      if (lane === 'Press run' && r.lane !== 'press_run') return false;
      if (show === 'Waiting and held' && r.statusKind === 'released') return false;
      if (show === 'In an open batch' && !(r.batch && r.statusKind !== 'released')) return false;
      if (show === 'Pushed out' && r.statusKind !== 'released') return false;
      if (q && ![r.order, r.customer, r.product, r.stock, r.status].some((v) => v.toLowerCase().includes(q))) return false;
      if (!passesTagFilter(tagFilter, r.tags)) return false;
      return true;
    });
  }, [all, channel, lane, show, search, tagFilter]);
  const tags = useMemo(() => tagUniverse(orders.map((o) => o.tags)), [orders]);
  const rows = useMemo(() => sortRows(filtered, sort.key, sort.direction), [filtered, sort]);

  const waiting = all.filter((r) => r.statusKind === 'unbatched').length;
  const waitingOld = all.filter((r) => r.statusKind === 'unbatched' && r.age > 2 * 86400).length;
  const inOpen = all.filter((r) => r.batch != null && r.statusKind !== 'released').length;
  const openBatches = batches.filter((b) => b.release_state == null && !b.cancelled);
  const held = all.filter((r) => r.statusKind === 'held').length;
  const oldest = all.reduce((m, r) => Math.max(m, r.age), 0);
  const channels = new Set(all.map((r) => r.channel)).size;

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>All Channel Orders</h1>
        <span style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
          {all.length} lines · from {channels} channel{channels === 1 ? '' : 's'} · oldest {ageText(oldest)}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--sg-muted)' }}>Lines arrive as orders are placed. Nothing here is a weekly pull.</span>
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
          Lane
          <select aria-label="Lane" value={lane} onChange={(e) => setLane(e.target.value)} style={selectStyle}>
            {['All', 'Press run', 'Stocked goods'].map((c) => (
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
        <ProductionSearch value={search} onChange={setSearch} />
      </div>
      {tags.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', fontSize: 14 }} data-testid="tag-chips">
          <span style={{ color: 'var(--sg-muted)' }}>Tags</span>
          {tags.map((tag) => {
            const mode = tagMode(tagFilter, tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter((f) => cycleTag(f, tag))}
                aria-pressed={mode !== null}
                data-mode={mode ?? 'off'}
                title={mode === null ? `Only ${tag}` : mode === 'include' ? `Hide ${tag}` : 'Clear'}
                style={{
                  ...pill,
                  padding: '4px 10px',
                  border: '1px solid',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontSize: 13,
                  minHeight: 32,
                  ...(mode === 'include' ? { background: 'var(--sg-ok-bg)', color: 'var(--sg-ok)', borderColor: 'var(--sg-ok)' } : mode === 'exclude' ? { background: 'var(--sg-danger-bg)', color: 'var(--sg-danger)', borderColor: 'var(--sg-danger)', textDecoration: 'line-through' } : { background: 'var(--sg-surface)', color: 'var(--sg-muted-2)', borderColor: 'var(--sg-line-2)' }),
                }}
              >
                {mode === 'include' ? `only ${tag}` : mode === 'exclude' ? `no ${tag}` : tag}
              </button>
            );
          })}
          {tagFilter.include.length || tagFilter.exclude.length ? (
            <span style={{ color: 'var(--sg-muted)' }} data-testid="tag-filter-text">
              {tagFilterText(tagFilter)} ·{' '}
              <button type="button" onClick={() => setTagFilter(EMPTY_TAG_FILTER)} style={{ all: 'unset', color: 'var(--sg-ok)', cursor: 'pointer', textDecoration: 'underline' }}>
                clear
              </button>
            </span>
          ) : (
            <span style={{ color: 'var(--sg-muted)' }}>press once to keep only, twice to hide</span>
          )}
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <Tile label="Waiting for a batch" value={String(waiting)} note={`${waitingOld} older than 2 days`} />
        <Tile label="In open batches" value={String(inOpen)} note={`${openBatches.length} batches, ${openBatches.filter((b) => b.full).length} full`} />
        <Tile label="Held" value={String(held)} note={held ? 'waiting on you' : 'nothing held'} color={held ? 'var(--sg-danger)' : undefined} />
        <Tile label="Order → received" value={taylor.length ? 'minutes' : '—'} note="was 3.5 days by weekly pull" />
      </div>
      {error ? <div role="alert" style={{ color: 'var(--sg-danger)' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: 'var(--sg-muted)' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      <div style={{ background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h.label} style={thStyle} aria-sort={h.key && sort.key === h.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {h.key ? (
                    <button
                      type="button"
                      onClick={() => setSort((s) => nextSort(s, h.key as SortKey, ['received']))}
                      style={{ all: 'unset', cursor: 'pointer', font: 'inherit', color: sort.key === h.key ? 'var(--sg-ok)' : 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', padding: '4px 0', minHeight: 24 }}
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
            {rows.length === 0 ? (
              <tr>
                <td style={{ ...tdStyle, color: 'var(--sg-muted)' }} colSpan={HEADERS.length} data-testid="no-rows">
                  {search.trim() ? `No results for "${search.trim()}"` : 'Nothing to show.'}
                </td>
              </tr>
            ) : null}
            {rows.map((r) => (
              <tr key={r.id} style={r.statusKind === 'held' ? { background: 'var(--sg-danger-tint)' } : undefined}>
                <td style={{ ...tdStyle, ...mono }}>{receivedText(r.received)}</td>
                <td style={{ ...tdStyle, ...(r.age > 2 * 86400 ? { color: 'var(--sg-danger)', fontWeight: 600 } : {}) }}>{ageText(r.age)}</td>
                <td style={tdStyle}>
                  <span style={{ ...pill, ...CHANNEL_PILL[r.channel] }}>{r.channel}</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ ...pill, ...LANE_PILL[r.lane] }} data-testid="lane">{LANE_PILL[r.lane].text}</span>
                </td>
                <td style={{ ...tdStyle, ...mono }}>
                  {r.orderId ? (
                    <Link to={`/production/orders/${r.orderId}/whereabouts`} style={{ color: 'var(--sg-ok)' }} title="Where did this order go" data-testid="whereabouts-link">
                      {r.order}
                    </Link>
                  ) : (
                    r.order
                  )}
                  {!readOnly && r.orderId ? (
                    <div style={{ marginTop: 2 }}>
                      <TagEditor tags={r.tags} options={shopTags} readOnly={false} compact busy={tagBusy === r.orderId} onChange={(next) => setTags(r.orderId as string, next)} />
                    </div>
                  ) : r.tags.length ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                      {r.tags.map((t) => (
                        <span key={t} style={{ ...pill, background: 'var(--sg-surface-3)', color: 'var(--sg-muted-2)', fontSize: 11 }} data-testid="row-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </td>
                <td style={tdStyle}>{r.customer || '—'}</td>
                <td style={{ ...tdStyle, ...mono }}>{r.line}</td>
                <td style={tdStyle}>{r.product}</td>
                <td style={{ ...tdStyle, ...mono }}>
                  {r.qty} × {r.pack}
                </td>
                <td style={{ ...tdStyle, ...mono }}>{r.slots}</td>
                <td style={{ ...tdStyle, ...(r.stock ? {} : { color: 'var(--sg-danger)' }) }}>{r.stock || 'unknown'}</td>
                <td style={tdStyle}>
                  <span style={{ ...pill, ...STATUS_PILL[r.statusKind] }}>{r.status}</span>
                </td>
                <td style={tdStyle}>
                  {r.batch != null ? (
                    <Link to="/production/batches" style={{ ...mono, color: 'var(--sg-ok)' }}>
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
      <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
        Every row is a line, whatever channel it came from. A line's slots are qty × pack ÷ 250. "Waiting" means its batch is open and not yet full; age counts from when the
        customer placed the order, not from when we received it. PageDNA and email lines have no source yet; a Taylor PO is an order whose lines are pool lines, and a raw Taylor line appears here only until it is written (or while it is blocked).
      </div>
    </ProductionLayout>
  );
}

function Tile({ label, value, note, color }: { label: string; value: string; note: string; color?: string }) {
  return (
    <div style={{ background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4, color }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>{note}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--sg-line-2)', borderRadius: 6, background: 'var(--sg-surface)', font: 'inherit', fontSize: 14 };
const thStyle: React.CSSProperties = { textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--sg-muted)', padding: '10px 12px', borderBottom: '1px solid var(--sg-line-3)', letterSpacing: '.02em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '11px 12px', borderBottom: '1px solid var(--sg-line)', fontSize: 14, verticalAlign: 'top' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500, lineHeight: '18px' };
