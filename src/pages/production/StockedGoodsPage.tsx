import { useCallback, useEffect, useState } from 'react';
import { downloadShippingCsv, listStockedGoodsUnits, markPicked } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText } from '../../lib/production';
import { isShadowReader } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import type { StockedGoodsUnit } from '../../types/production';

/** Stocked goods end to end (dispatch 23 Nov 2026, item 1; rulings 20 Nov):
 * the pick-and-pack units — no art step, never a press run — oldest first.
 * A staff member marks one picked in two steps: the plan names the PO and
 * what the shipping row will carry; the confirm marks it, writes the row as
 * the shop's ALLORDER CSV (one row, this unit's own ship-to) with an audit
 * row, and offers the file. A mixed PO ships separately and the row says so
 * until a28 is answered. A read-only reader sees the state and no act. */

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: colors.vein, color: '#fff', borderColor: colors.vein };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };

export default function StockedGoodsPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const [units, setUnits] = useState<StockedGoodsUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [picking, setPicking] = useState<{ unit: StockedGoodsUnit; note: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setUnits(await listStockedGoodsUnits());
    } catch (e: unknown) {
      if (isNoFloorRole(e)) setNoRole(true);
      else setError(loadFailureText(e, 'Could not load the stocked goods'));
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function plan(unit: StockedGoodsUnit) {
    setError(null);
    setBusy(unit.unit_id);
    try {
      const answer = await markPicked(unit.unit_id, false);
      setPicking({ unit: answer.unit, note: answer.mixed_po_note });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Mark picked was refused');
    } finally {
      setBusy(null);
    }
  }

  async function confirm() {
    if (!picking) return;
    setBusy(picking.unit.unit_id);
    try {
      const answer = await markPicked(picking.unit.unit_id, true);
      setPicking(null);
      setNotice(`PO ${answer.unit.po} marked picked; its shipping row is written (${answer.shipping_rows} row).`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Mark picked was refused');
    } finally {
      setBusy(null);
    }
  }

  const waiting = units.filter((u) => !u.picked_at);
  const picked = units.filter((u) => !!u.picked_at);

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Stocked goods</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {waiting.length} to pick · {picked.length} picked. Pick and pack from the shelf; never a press run. Marking a PO picked writes its shipping row.
        </span>
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: '#4b5563' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {notice ? <div role="status" style={{ color: '#2e5c1f' }}>{notice}</div> : null}
      {picking ? (
        <div role="dialog" aria-modal="true" aria-label={`Mark PO ${picking.unit.po} picked`} style={{ position: 'fixed', inset: 0, background: 'rgba(28, 25, 23, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} data-testid="mark-picked-dialog">
          <div style={{ ...card, maxWidth: 560, width: '100%', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Mark PO {picking.unit.po} picked</div>
            <div style={{ fontSize: 14 }} data-testid="mark-picked-plan">
              {picking.unit.lines.length} line{picking.unit.lines.length === 1 ? '' : 's'} for {picking.unit.customer || 'the customer'}. Confirming writes one shipping row for this PO — its own ship-to, this unit's token — and records who marked it and when. Nothing is printed by it.
            </div>
            {picking.note ? (
              <div style={{ fontSize: 14, color: '#7a5a12' }} data-testid="mixed-po-note">
                {picking.note}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" disabled={busy !== null} onClick={confirm} style={{ ...btn, ...btnPrimary }} data-testid="mark-picked-confirm">
                Yes, mark PO {picking.unit.po} picked
              </button>
              <button type="button" onClick={() => setPicking(null)} style={btn}>
                Not now
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {units.length === 0 && !error && !noRole ? <div style={{ color: '#4b5563' }} data-testid="no-units">No stocked goods waiting.</div> : null}
      {[...waiting, ...picked].map((u) => (
        <div key={u.unit_id} style={card} data-testid={`stocked-unit-${u.unit_id}`} data-picked={u.picked_at ? 'yes' : 'no'}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600 }}>PO {u.po}</span>
            <span>{u.customer}</span>
            <span style={{ color: '#4b5563', fontSize: 13 }}>received {ageText(u.age_seconds)} ago</span>
            {u.mixed_po ? (
              <span style={{ ...pill, background: '#fbf1d9', color: '#7a5a12' }} data-testid="mixed-po">mixed PO · ships separately</span>
            ) : null}
            <span style={{ marginLeft: 'auto', ...pill, ...(u.picked_at ? { background: '#e6f3ee', color: '#558b2f' } : { background: '#e9ebef', color: '#3f4854' }) }}>
              {u.picked_at ? `picked · ${new Date(u.picked_at).toLocaleString('en-US')}` : 'to pick'}
            </span>
          </div>
          <div style={{ fontSize: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {u.lines.map((l) => (
              <div key={l.line_item_id}>
                <span style={mono}>{l.product}</span> {l.product_name ? `· ${l.product_name}` : ''} · {l.quantity} × {l.pack_size}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {!readOnly && !u.picked_at ? (
              <button type="button" disabled={busy !== null} onClick={() => plan(u)} style={{ ...btn, ...btnPrimary }} data-testid="mark-picked">
                Mark picked…
              </button>
            ) : null}
            {u.shipping_csv ? (
              <button type="button" onClick={() => downloadShippingCsv(u.unit_id, u.shipping_csv!.filename).catch((e: unknown) => setError(e instanceof Error ? e.message : 'The file could not be fetched'))} style={btn} data-testid="shipping-csv">
                Shipping row · {u.shipping_csv.filename}
              </button>
            ) : u.picked_at ? null : (
              <span style={{ fontSize: 13, color: '#4b5563' }}>Shipping row: written when marked picked.</span>
            )}
          </div>
        </div>
      ))}
    </ProductionLayout>
  );
}
