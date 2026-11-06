import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listBatches, markHalfBatch } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText, slotStrip } from '../../lib/production';
import { channelLabel } from './AllChannelOrdersPage';
import type { BatchSummary } from '../../types/production';

/** Board 2: a batch is 24 slots on one stock. The strip shows what is
 * filled, what the fill advice could fill now, and what stays blank; nothing
 * pushes out without the confirmation screen. */

const SLOT: Record<'filled' | 'fill' | 'blank', React.CSSProperties> = {
  filled: { background: colors.leaf },
  fill: { background: '#f2b84b' },
  blank: { background: '#e6e9ee', border: '1px dashed #b7bec8' },
};

export function SlotStrip({ used, fillable, capacity, gap = 3 }: { used: number; fillable: number; capacity: number; gap?: number }) {
  const strip = slotStrip(used, fillable, capacity);
  const fill = strip.filter((s) => s === 'fill').length;
  const blank = strip.filter((s) => s === 'blank').length;
  const label = used >= capacity ? `${capacity} slots, all filled` : `${capacity} slots: ${used} filled, ${fill} fillable, ${blank} blank`;
  return (
    <div role="img" aria-label={label} data-testid="slot-strip" style={{ display: 'grid', gridTemplateColumns: `repeat(${capacity}, minmax(0, 1fr))`, gap }}>
      {strip.map((s, i) => (
        <div key={i} data-slot={s} style={{ height: 14, borderRadius: 2, ...SLOT[s] }} />
      ))}
    </div>
  );
}

function stateText(b: BatchSummary): { text: string; color?: string } {
  if (b.cancelled) return { text: 'cancelled', color: '#a3331d' };
  if (b.docket_number) return { text: `pushed out · Docket ${b.docket_number}` };
  if (b.release_state === 'needs_human') return { text: 'needs a person — check DocketManager', color: '#a3331d' };
  if (b.release_state === 'releasing') return { text: 'pushing out…', color: '#7a5a12' };
  if (b.release_state === 'retryable') return { text: 'push failed — try again', color: '#a3331d' };
  if (b.full) return { text: 'full', color: colors.vein };
  return { text: `${b.blanks} blank if pushed out now`, color: '#7a5a12' };
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState('Open');
  const navigate = useNavigate();

  async function halfBatch(batch: BatchSummary) {
    try {
      await markHalfBatch(batch.unit_id);
      navigate(`/production/batches/${batch.unit_id}/push-out`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The half batch was refused');
    }
  }

  useEffect(() => {
    listBatches()
      .then(setBatches)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the batches'));
  }, []);

  const open = useMemo(() => batches.filter((b) => !b.cancelled && !b.docket_number && b.release_state !== 'released'), [batches]);
  const pushedOut = useMemo(() => batches.filter((b) => b.docket_number || b.release_state === 'released'), [batches]);
  const shown = show === 'Open' ? open : show === 'Pushed out' ? pushedOut : batches;
  const nextNumber = batches.reduce((m, b) => Math.max(m, b.batch_number), 0) + 1;
  const [first, ...rest] = shown;

  return (
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Batches</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {open.length} open · {open.filter((b) => b.full).length} full and ready · next number {nextNumber}
        </span>
        <label style={{ marginLeft: 'auto', fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          Show
          <select value={show} onChange={(e) => setShow(e.target.value)} style={{ padding: '7px 10px', border: '1px solid #c9cfd6', borderRadius: 6, background: '#fff', font: 'inherit' }}>
            {['Open', 'Pushed out', 'All'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {first ? <BatchCard batch={first} featured onPushOut={() => navigate(`/production/batches/${first.unit_id}/push-out`)} onHalfBatch={() => halfBatch(first)} /> : <div style={{ color: '#4b5563' }}>No batches to show.</div>}
      {rest.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {rest.map((b) => (
            <BatchCard key={b.unit_id} batch={b} onPushOut={() => navigate(`/production/batches/${b.unit_id}/push-out`)} onHalfBatch={() => halfBatch(b)} />
          ))}
        </div>
      ) : null}
      <div style={{ background: '#f9fafb', border: '1px solid #e1e5ea', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontWeight: 500 }}>Pushed out</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14 }}>
          {pushedOut.length === 0 ? <span style={{ color: '#4b5563' }}>None yet.</span> : null}
          {pushedOut.map((b) => (
            <span key={b.unit_id}>
              <span style={mono}>{b.batch_number}</span> · {b.stock} · {b.used}/{b.capacity}
              {b.blanks ? ` (+${b.blanks} blank)` : ''} · Docket <span style={mono}>{b.docket_number ?? '—'}</span>
              {b.released_at ? ` · ${new Date(b.released_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          ))}
          <span style={{ color: '#4b5563' }}>Every push-out has a Docket number or a written reason. None are missing.</span>
        </div>
      </div>
    </ProductionLayout>
  );
}

export const HALF_CAPACITY = 12;
export const HALF_SHEETS = 125;

export function halfBatchOffered(batch: BatchSummary): boolean {
  return !batch.half && !batch.full && !batch.cancelled && !batch.docket_number && batch.release_state !== 'releasing' && batch.release_state !== 'released' && batch.used > 0 && batch.used <= HALF_CAPACITY;
}

function BatchCard({ batch, featured = false, onPushOut, onHalfBatch }: { batch: BatchSummary; featured?: boolean; onPushOut: () => void; onHalfBatch?: () => void }) {
  const state = stateText(batch);
  const pushable = !batch.cancelled && !batch.docket_number && batch.release_state !== 'releasing' && batch.release_state !== 'released' && batch.used > 0;
  return (
    <div
      className="card"
      style={{ background: '#fff', border: `${featured ? 2 : 1}px solid ${featured ? colors.vein : '#e1e5ea'}`, borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div>
          <span style={lbl}>Batch</span>
          <div style={{ ...mono, fontSize: 22, fontWeight: 600 }}>{batch.batch_number}</div>
        </div>
        <div>
          <span style={lbl}>Stock</span>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{batch.stock || 'unknown'}</div>
        </div>
        <div>
          <span style={lbl}>Slots</span>
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {batch.used} / {batch.capacity}{batch.half ? ' · half' : ''} · <span style={{ color: state.color }}>{state.text}</span>
          </div>
        </div>
        <div>
          <span style={lbl}>Orders</span>
          <div style={{ fontSize: 16 }}>
            {batch.orders} · {batch.channels.length} channel{batch.channels.length === 1 ? '' : 's'}
          </div>
        </div>
        <div>
          <span style={lbl}>Oldest line</span>
          <div style={{ fontSize: 16, ...(batch.oldest_line_age_seconds != null && batch.oldest_line_age_seconds > 7 * 86400 ? { color: '#a3331d', fontWeight: 600 } : {}) }}>
            {batch.oldest_line_age_seconds != null ? `${ageText(batch.oldest_line_age_seconds)} · ${batch.oldest_line_ref ?? ''}` : '—'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" style={btn} disabled title="Moving orders is not built yet">
            Move orders…
          </button>
          {pushable ? (
            <button type="button" onClick={onPushOut} style={batch.full ? { ...btn, ...btnPrimary } : btn}>
              {batch.full ? `Push out ${batch.batch_number} →` : `Push out with ${batch.blanks} blank${batch.blanks === 1 ? '' : 's'}…`}
            </button>
          ) : null}
          {onHalfBatch && halfBatchOffered(batch) ? (
            <button type="button" onClick={onHalfBatch} style={btn} title={`A half batch holds ${HALF_CAPACITY} slots and runs ${HALF_SHEETS} sheets; every order still gets its 250 cards`}>
              Half batch ({HALF_CAPACITY} at {HALF_SHEETS} sheets)…
            </button>
          ) : null}
        </div>
      </div>
      <SlotStrip used={batch.used} fillable={batch.fillable_slots} capacity={batch.capacity} />
      {batch.fill_candidates.length ? (
        <div style={{ background: '#fbf6e8', border: '1px solid #efd9a3', borderRadius: 6, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontWeight: 500 }}>
            Fill advice — {batch.fillable_slots} of the {batch.blanks} blank{batch.blanks === 1 ? '' : 's'} can be filled now, by orders already received
          </div>
          {batch.fill_candidates.map((c) => (
            <div key={c.order_ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 14 }}>
              <span style={mono}>{c.order_ref}</span>
              <span>
                {channelLabel(c.channel)} · {c.stock || batch.stock} · {c.slots} slot{c.slots === 1 ? '' : 's'} · {ageText(c.age_seconds)} old · currently waiting, not yet batched
              </span>
            </div>
          ))}
        </div>
      ) : batch.blanks > 0 && !batch.docket_number ? (
        <div style={{ fontSize: 13, color: '#4b5563' }}>No waiting order of this stock fits the blanks; they stay blank unless one arrives.</div>
      ) : null}
      {featured ? (
        <div style={{ fontSize: 13, color: '#4b5563' }}>
          Pushing out writes the art files and the job ticket, creates the Docket order <span style={mono}>BC Batch{batch.stock} {batch.batch_number}</span> and records its number on the batch. You confirm on the next screen; nothing moves until then.
        </div>
      ) : null}
      {!featured ? (
        <div style={{ fontSize: 13 }}>
          <Link to="/production/orders" style={{ color: colors.vein }}>
            its lines
          </Link>
        </div>
      ) : null}
    </div>
  );
}

const lbl: React.CSSProperties = { fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: colors.vein, color: '#fff', borderColor: colors.vein };
