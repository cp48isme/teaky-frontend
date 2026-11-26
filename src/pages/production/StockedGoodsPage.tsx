import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../api/client';
import { downloadShippingCsv, listStockedGoodsUnits, markPicked } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText } from '../../lib/production';
import { currentUserId, isShadowReader } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import type { MarkPickedResult, StockedGoodsLine, StockedGoodsUnit } from '../../types/production';

/** Stocked goods end to end (dispatch 23 Nov 2026, item 1; rulings 20 Nov):
 * the pick-and-pack units — no art step, never a press run — oldest first.
 * A staff member marks one picked in two steps: the plan names the PO and
 * what the shipping row will carry; the confirm marks it, writes the row as
 * the shop's ALLORDER CSV (one row, this unit's own ship-to) with an audit
 * row, and offers the file. A mixed PO ships separately and the row says so
 * until a28 is answered. A read-only reader sees the state and no act.
 *
 * Walk C2 (26 Nov 2026): the pick lines are what the picker reads, so they
 * are the card's heading — the largest, darkest, proportional type on it —
 * and say the item, the pieces, and the catalogue code in words. The result
 * of a confirm renders in place on the card (picked badge, the shipping row
 * as a file), and every refusal shows its reason on the card it refused.
 * There is no undo route on the server, so no undo control is offered. */

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: colors.vein, color: '#fff', borderColor: colors.vein };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };
const pickLine: React.CSSProperties = { margin: 0, fontSize: 20, lineHeight: 1.3, fontWeight: 600, color: '#111827' };
const pickDetail: React.CSSProperties = { fontSize: 14, color: '#1f2937' };

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Pieces = packs × pack size: the order line's quantity is packs of
 * pack_size pieces (the server's order schema says so). */
export function piecesText(line: Pick<StockedGoodsLine, 'quantity' | 'pack_size'>): string {
  return plural(line.quantity * line.pack_size, 'piece', 'pieces');
}

/** How the pieces are packed, in words; empty when each pack is one piece. */
export function packText(line: Pick<StockedGoodsLine, 'quantity' | 'pack_size'>): string {
  if (line.pack_size <= 1) return '';
  return `${plural(line.quantity, 'pack', 'packs')} of ${line.pack_size}`;
}

/** The reason a refusal shows on the card, by what refused it. */
export function refusalText(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 409) return `Not marked — ${e.message}`;
    if (e.status === 403) return `Not allowed — ${e.message}`;
    if (e.status === 404) return `Not found — ${e.message}`;
    return `Refused (${e.status}) — ${e.message}`;
  }
  if (e instanceof Error) return `Could not reach the server — ${e.message}. Nothing was marked.`;
  return 'Mark picked was refused.';
}

function when(iso: string): string {
  return new Date(iso).toLocaleString('en-US');
}

export default function StockedGoodsPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const [units, setUnits] = useState<StockedGoodsUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [picking, setPicking] = useState<{ unit: StockedGoodsUnit; note: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  // The confirm's answer, kept on the card it came from; the card shows it
  // over the list's row until the list carries the same picked state.
  const [results, setResults] = useState<Record<string, MarkPickedResult>>({});
  // A refusal's reason, on the card that was refused.
  const [refusals, setRefusals] = useState<Record<string, string>>({});
  const me = currentUserId();

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

  function refuse(unitId: string, e: unknown) {
    setRefusals((prev) => ({ ...prev, [unitId]: refusalText(e) }));
  }

  async function plan(unit: StockedGoodsUnit) {
    setRefusals((prev) => ({ ...prev, [unit.unit_id]: '' }));
    setBusy(unit.unit_id);
    try {
      const answer = await markPicked(unit.unit_id, false);
      setPicking({ unit: answer.unit, note: answer.mixed_po_note });
    } catch (e: unknown) {
      refuse(unit.unit_id, e);
    } finally {
      setBusy(null);
    }
  }

  async function confirm() {
    if (!picking) return;
    const unitId = picking.unit.unit_id;
    setBusy(unitId);
    try {
      const answer = await markPicked(unitId, true);
      setPicking(null);
      setResults((prev) => ({ ...prev, [unitId]: answer }));
      await load();
    } catch (e: unknown) {
      setPicking(null);
      refuse(unitId, e);
    } finally {
      setBusy(null);
    }
  }

  const effective = (u: StockedGoodsUnit): StockedGoodsUnit => {
    const r = results[u.unit_id];
    return r && !u.picked_at ? r.unit : u;
  };
  const shown = units.map(effective);
  const waiting = shown.filter((u) => !u.picked_at);
  const picked = shown.filter((u) => !!u.picked_at);

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Stocked goods</h1>
          <span style={{ color: '#4b5563', fontSize: 14 }}>
            {waiting.length} to pick · {picked.length} picked
          </span>
        </div>
        <p style={{ margin: 0, color: '#374151', fontSize: 14 }} data-testid="page-purpose">
          This page is where the shop picks and packs goods from the shelf — never a press run — and marking a PO picked writes its shipping row.
        </p>
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: '#4b5563' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {picking ? (
        <div role="dialog" aria-modal="true" aria-label={`Mark PO ${picking.unit.po} picked`} style={{ position: 'fixed', inset: 0, background: 'rgba(28, 25, 23, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} data-testid="mark-picked-dialog">
          <div style={{ ...card, maxWidth: 560, width: '100%', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Mark PO {picking.unit.po} picked</div>
            <div style={{ fontSize: 14 }} data-testid="mark-picked-plan">
              {picking.unit.lines.length} line{picking.unit.lines.length === 1 ? '' : 's'} for {picking.unit.customer || 'the customer'}. Confirming writes one shipping row for this PO — its own ship-to, this unit's token — and records who marked it and when. Nothing is printed by it.
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, fontWeight: 500 }}>
              {picking.unit.lines.map((l) => (
                <li key={l.line_item_id}>
                  {l.product_name || l.product} — {piecesText(l)}
                </li>
              ))}
            </ul>
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
      {[...waiting, ...picked].map((u) => {
        const result = results[u.unit_id];
        const refusal = refusals[u.unit_id];
        const pickedByYou = !!u.picked_at && (!!result || (!!u.picked_by_id && u.picked_by_id === me));
        return (
          <div key={u.unit_id} style={card} data-testid={`stocked-unit-${u.unit_id}`} data-picked={u.picked_at ? 'yes' : 'no'}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline', fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>PO {u.po}</span>
              <span>{u.customer}</span>
              <span style={{ color: '#4b5563', fontSize: 13 }}>received {ageText(u.age_seconds)} ago</span>
              {u.mixed_po ? (
                <span style={{ ...pill, background: '#fbf1d9', color: '#7a5a12' }} data-testid="mixed-po">mixed PO · ships separately</span>
              ) : null}
              <span style={{ marginLeft: 'auto', ...pill, ...(u.picked_at ? { background: '#e6f3ee', color: '#2e5c1f' } : { background: '#e9ebef', color: '#3f4854' }) }} data-testid="picked-badge">
                {u.picked_at ? `Picked ${when(u.picked_at)}${pickedByYou ? ' by you' : ''}` : 'To pick'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} data-testid="pick-lines">
              {u.lines.map((l) => (
                <div key={l.line_item_id} data-testid="pick-line">
                  <h2 style={pickLine} data-testid="pick-line-heading">
                    {l.product_name || l.product} — {piecesText(l)}
                  </h2>
                  <div style={pickDetail}>
                    Catalogue code {l.product}
                    {packText(l) ? ` · ${packText(l)}` : ''}
                  </div>
                </div>
              ))}
            </div>
            {result ? (
              <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px', borderRadius: 6, background: '#e6f3ee', color: '#1f3d14', fontSize: 14 }} data-testid="mark-picked-result">
                <span>
                  PO {result.unit.po} marked picked; its shipping row is written ({plural(result.shipping_rows, 'row', 'rows')}).
                </span>
                {result.unit.shipping_csv ? (
                  <span>Shipping row written — {result.unit.shipping_csv.filename}; download it below.</span>
                ) : (
                  <span>Shipping row written — the file is listed on this card once the list refreshes.</span>
                )}
              </div>
            ) : null}
            {refusal ? (
              <div role="alert" style={{ padding: '10px 12px', borderRadius: 6, background: '#fbe9e4', color: '#8a2a14', fontSize: 14 }} data-testid="mark-picked-refusal">
                {refusal}
              </div>
            ) : null}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              {!readOnly && !u.picked_at ? (
                <button type="button" disabled={busy !== null} onClick={() => plan(u)} style={{ ...btn, ...btnPrimary }} data-testid="mark-picked">
                  Mark picked…
                </button>
              ) : null}
              {u.shipping_csv ? (
                <button type="button" onClick={() => downloadShippingCsv(u.unit_id, u.shipping_csv!.filename).catch((e: unknown) => refuse(u.unit_id, e))} style={btn} data-testid="shipping-csv">
                  Download shipping row · {u.shipping_csv.filename}
                </button>
              ) : u.picked_at ? null : (
                <span style={{ fontSize: 13, color: '#4b5563' }}>Two steps: first a plan of what the row will carry, then the confirm writes the shipping row and records who marked it.</span>
              )}
            </div>
          </div>
        );
      })}
    </ProductionLayout>
  );
}
