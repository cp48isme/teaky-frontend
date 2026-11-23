import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderWhereabouts } from '../../api/whereabouts';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText, ageSeconds } from '../../lib/production';
import { isShadowReader } from '../../lib/roles';
import { locationText, unitStateText } from '../../lib/whereaboutsCopy';
import type { OrderWhereabouts } from '../../types/whereabouts';

/** Where did this order go (dispatch 17–18 Nov 2026, items 1 and 2): one
 * read — the order's lines, its units at both levels, where each stands on
 * its route, every scan, the holds, the pushes to Docket, what shipped and
 * what it waits on now. Reached from each order row on All Channel Orders.
 * The shadow_reader reads it as it reads the queue. */

const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', fontSize: 12, color: 'var(--sg-muted)', padding: '8px 10px', borderBottom: '1px solid var(--sg-line-3)', textTransform: 'uppercase', letterSpacing: '.02em', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)', fontSize: 14, verticalAlign: 'top' };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };

function when(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Fact({ label, value, isMono = false }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div>
      <span style={lbl}>{label}</span>
      <div style={{ fontSize: 15, ...(isMono ? mono : {}) }}>{value || '—'}</div>
    </div>
  );
}

export default function WhereaboutsPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const { orderId = '' } = useParams();
  const [data, setData] = useState<OrderWhereabouts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderWhereabouts(orderId)
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the order'));
  }, [orderId]);

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{data ? `Where did ${data.order_ref} go` : 'Where did this order go'}</h1>
        {data ? (
          <span style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
            {data.channel} · {data.customer || 'no customer named'} · placed {ageText(ageSeconds(data.placed_at))} ago · {data.status}
            {data.release_state ? ` · ${data.release_state}` : ''}
          </span>
        ) : null}
        <Link to="/production/orders" style={{ marginLeft: 'auto', color: colors.vein, fontSize: 14 }}>
          ← All Channel Orders
        </Link>
      </div>
      {error ? (
        <div role="alert" style={{ color: 'var(--sg-danger)' }}>
          {error}
        </div>
      ) : null}
      {data ? (
        <>
          <section style={card} aria-labelledby="waiting-on" data-testid="waiting-on">
            <h2 id="waiting-on" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
              {data.shipped ? 'Shipped' : data.waiting_on.length ? 'Waiting on' : 'Nothing to wait on'}
            </h2>
            {data.shipped ? (
              <div style={{ fontSize: 14 }}>
                Left {when(data.shipped.shipped_at)}
                {data.shipped.carrier ? ` · ${data.shipped.carrier}` : ''}
                {data.shipped.tracking ? (
                  <>
                    {' '}· tracking <span style={mono}>{data.shipped.tracking}</span>
                  </>
                ) : null}
              </div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {data.waiting_on.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <Fact label="Last scan" value={data.last_scan ? `${data.last_scan.scan} ${data.last_scan.position} ${data.last_scan.step} by ${data.last_scan.scanned_by}${data.last_scan.station ? ` at ${data.last_scan.station}` : ''} · ${when(data.last_scan.at)}` : 'none yet'} />
              <Fact label="Entity" value={data.business_entity} />
              <Fact label="Tags" value={data.tags.join(', ')} />
              <Fact label="Order number" value={data.order_number} isMono />
            </div>
          </section>

          <section style={card} aria-labelledby="units">
            <h2 id="units" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Units</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }} data-testid="units-table">
                <thead>
                  <tr>
                    {['Unit', 'Kind', 'State', 'Where', 'Since', 'Scan code', 'Docket', 'Entity', 'Holds'].map((h) => (
                      <th key={h} style={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.units.map((u) => (
                    <tr key={u.unit_id} data-testid="unit-row">
                      <td style={{ ...td, ...mono }}>{u.reference}</td>
                      <td style={td}>{u.kind}</td>
                      <td style={td}>
                        <span style={{ ...pill, background: u.cancelled_at ? 'var(--sg-pill)' : u.holds.some((h) => !h.cleared_at) ? 'var(--sg-danger-bg)' : 'var(--sg-ok-bg)', color: u.cancelled_at ? 'var(--sg-muted-2)' : u.holds.some((h) => !h.cleared_at) ? 'var(--sg-danger)' : 'var(--sg-ok)' }}>{unitStateText(u)}</span>
                      </td>
                      <td style={td}>{locationText(u)}</td>
                      <td style={{ ...td, ...mono }}>{when(u.location.since)}</td>
                      <td style={{ ...td, ...mono }}>{u.scan_code || '—'}</td>
                      <td style={{ ...td, ...mono }}>{u.docket_number ?? '—'}</td>
                      <td style={td}>{u.business_entity || '—'}</td>
                      <td style={td}>{u.holds.length ? u.holds.map((h) => `${h.reason}${h.cleared_at ? ' (cleared)' : ''}`).join(', ') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={card} aria-labelledby="scans">
            <h2 id="scans" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Scans</h2>
            {data.units.every((u) => u.scans.length === 0) ? (
              <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>No scan yet.</div>
            ) : (
              <table style={{ borderCollapse: 'collapse', width: '100%' }} data-testid="scans-table">
                <thead>
                  <tr>
                    {['When', 'Unit', 'Scan', 'Step', 'By', 'Station'].map((h) => (
                      <th key={h} style={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.units
                    .flatMap((u) => u.scans.map((s) => ({ unit: u.reference, ...s })))
                    .sort((a, b) => a.at.localeCompare(b.at))
                    .map((s, i) => (
                      <tr key={`${s.unit}-${s.at}-${i}`}>
                        <td style={{ ...td, ...mono }}>{when(s.at)}</td>
                        <td style={{ ...td, ...mono }}>{s.unit}</td>
                        <td style={td}>{s.scan}</td>
                        <td style={td}>
                          {s.position} {s.step}
                        </td>
                        <td style={td}>{s.scanned_by}</td>
                        <td style={td}>{s.station || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>

          <section style={card} aria-labelledby="lines">
            <h2 id="lines" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Lines</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }} data-testid="lines-table">
              <thead>
                <tr>
                  {['Line', 'Product', 'Qty × pack', 'Cards', 'Scan code', 'In unit', 'Art'].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.lines.map((l) => {
                  const unit = data.units.find((u) => u.unit_id === l.production_unit_id) ?? data.units.find((u) => u.unit_id === l.shipment_unit_id);
                  return (
                    <tr key={l.line_item_id}>
                      <td style={{ ...td, ...mono }}>{l.line_no}</td>
                      <td style={td}>{l.product}</td>
                      <td style={{ ...td, ...mono }}>
                        {l.quantity} × {l.pack_size}
                      </td>
                      <td style={{ ...td, ...mono }}>{l.cards}</td>
                      <td style={{ ...td, ...mono }}>{l.scan_code}</td>
                      <td style={td}>{l.production_unit_id ? unit?.reference ?? 'a production unit' : 'waiting for a batch'}</td>
                      <td style={td}>{l.art_source || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {data.pushes.length ? (
            <section style={card} aria-labelledby="pushes">
              <h2 id="pushes" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Pushes to Docket</h2>
              {data.pushes.map((p, i) => (
                <div key={`${p.unit_id}-${p.at}-${i}`} style={{ fontSize: 14 }}>
                  <span style={mono}>{when(p.at)}</span> · {data.units.find((u) => u.unit_id === p.unit_id)?.reference ?? p.unit_id} · {p.outcome}
                  {p.docket_number ? ` · Docket ${p.docket_number}` : ''} · by {p.by}
                </div>
              ))}
            </section>
          ) : null}
        </>
      ) : null}
    </ProductionLayout>
  );
}
