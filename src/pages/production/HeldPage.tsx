import { useCallback, useEffect, useMemo, useState } from 'react';
import { listPrinterOrders } from '../../api/orders';
import { getProductionSettings, getSpecSuggestion, listTaylorPool, updateProductionSettings } from '../../api/production';
import { clearUnitHold, listHeldQueue, splitHoldOnce } from '../../api/releaseUnits';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText } from '../../lib/production';
import { onePressResolution, splitHeld, stockChoices, type HeldRow } from '../../lib/held';
import type { Order } from '../../types/order';
import type { ProductionSettings, SpecSuggestion, StockEvidence, TaylorPoolLine } from '../../types/production';
import type { HeldQueueEntry } from '../../types/releaseUnit';
import { isShadowReader } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import ProposalsPanel, { type ProposalTarget } from '../../components/production/ProposalsPanel';

/** Board 4: Held — the suggestion, one answer. Two lists: "Waiting for a
 * fact" (nobody decides; it clears when the thing arrives) and "Needs a
 * decision" (the facts are known; answer once, or tick "always"). */

const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid var(--sg-line-2)', background: 'var(--sg-surface)', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const primary: React.CSSProperties = { ...btn, background: colors.vein, color: 'var(--sg-surface)', borderColor: colors.vein };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 };

function WaitingPill({ on }: { on: HeldRow['waitingOn'] }) {
  const hot = on === 'you';
  return <span style={{ ...pill, background: hot ? 'var(--sg-danger-bg)' : 'var(--sg-pill)', color: hot ? 'var(--sg-danger)' : 'var(--sg-muted-2)' }}>Waiting on: {on === 'you' ? 'you' : on}</span>;
}

function FactRow({ row, onFetchNow, fetching, readOnly = false }: { row: HeldRow; onFetchNow: () => void; fetching: boolean; readOnly?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr) 80px 170px', gap: 16, alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid var(--sg-surface-3)' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{row.title}</div>
        <div style={mono}>{row.order}</div>
        <div style={{ color: 'var(--sg-muted)', fontSize: 13 }}>{row.summary}</div>
      </div>
      <div style={{ fontSize: 14 }}>{row.detail}</div>
      <div style={{ ...mono, color: row.ageSeconds > 2 * 86400 ? 'var(--sg-danger)' : undefined }}>{ageText(row.ageSeconds)}</div>
      <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
        {row.clears} ·{' '}
        {readOnly ? null : row.taylorLineId ? (
          <button type="button" onClick={onFetchNow} disabled={fetching} style={{ all: 'unset', color: colors.vein, cursor: 'pointer', textDecoration: 'underline' }}>
            {fetching ? 'fetching…' : 'fetch now'}
          </button>
        ) : row.reason === 'awaiting_proof' ? (
          <a href={`/printer/orders/${row.unitId ?? ''}`} style={{ color: colors.vein }}>
            nudge
          </a>
        ) : null}
      </div>
    </div>
  );
}

function EvidenceTable({ suggestion }: { suggestion: SpecSuggestion | null }) {
  const rows: { what: string; says: string; stock: string }[] = [];
  if (suggestion?.library) rows.push({ what: 'Library', says: `row in force, source ${suggestion.library.source}`, stock: suggestion.library.value });
  for (const h of suggestion?.history ?? []) for (const e of h.evidence) rows.push({ what: evidenceName(e), says: e.detail, stock: e.stock });
  for (const p of suggestion?.proposals ?? []) rows.push({ what: 'Docket says', says: `proposed from ${p.evidence[0]?.detail ?? 'an item code'} (hint)`, stock: p.value });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) 110px', gap: '8px 16px', fontSize: 14, alignItems: 'baseline' }}>
      <div style={lbl}>Evidence</div>
      <div style={lbl}>What it says</div>
      <div style={lbl}>Stock</div>
      {rows.length ? (
        rows.map((r, i) => (
          <EvidenceCells key={i} {...r} />
        ))
      ) : (
        <div style={{ gridColumn: '1 / -1', color: 'var(--sg-muted)' }}>No evidence yet for this product: nothing of the customer's, no matching description, no Docket code.</div>
      )}
    </div>
  );
}

function EvidenceCells({ what, says, stock }: { what: string; says: string; stock: string }) {
  const cell: React.CSSProperties = { padding: '6px 0', borderBottom: '1px solid var(--sg-surface-3)' };
  return (
    <>
      <div style={cell}>{what}</div>
      <div style={cell}>{says}</div>
      <div style={{ ...cell, ...mono }}>{stock || '—'}</div>
    </>
  );
}

function evidenceName(e: StockEvidence): string {
  if (e.kind === 'prior_units') return 'Ran before';
  if (e.kind === 'customer_products') return 'Same customer';
  if (e.kind === 'description_tokens') return 'Description';
  if (e.kind === 'person_note') return 'A person';
  return e.kind;
}

function DecisionCard({
  row,
  suggestion,
  settings,
  onAnswer,
  onAlwaysSplit,
  onSplitOnce,
  busy,
}: {
  row: HeldRow;
  suggestion: SpecSuggestion | null;
  settings: ProductionSettings | null;
  onAnswer: (stock: string, evidence: StockEvidence[]) => void;
  onAlwaysSplit: (on: boolean) => void;
  onSplitOnce: () => void;
  busy: boolean;
}) {
  const evidence = useMemo(() => {
    const all: StockEvidence[] = [];
    for (const h of suggestion?.history ?? []) all.push(...h.evidence);
    return all;
  }, [suggestion]);
  const leading = suggestion?.leading_value ?? null;
  const [other, setOther] = useState('');
  return (
    <div style={card} data-testid={`decision-${row.reason}`}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600 }}>{row.title}</span>
        <span style={mono}>{row.order}</span>
        <span style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
          {row.summary} · received {ageText(row.ageSeconds)} ago
        </span>
        <span style={{ marginLeft: 'auto' }}>
          <WaitingPill on={row.waitingOn} />
        </span>
      </div>
      {row.reason === 'stock_unknown' ? (
        <>
          <div style={{ fontSize: 14 }}>
            This product has never been through a batch, so its stock is not in the library. Here is what the evidence says — pick one, or type another. Your answer is remembered for this product.
          </div>
          <EvidenceTable suggestion={suggestion} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {stockChoices(leading).map((stock, i) => (
              <button key={stock} type="button" disabled={busy} onClick={() => onAnswer(stock, evidence)} style={i === 0 && leading ? primary : btn}>
                {i === 0 && leading ? `${stock} — answer and place it` : stock}
              </button>
            ))}
            <span style={{ color: 'var(--sg-muted)' }}>or</span>
            <input aria-label="Another stock" value={other} onChange={(e) => setOther(e.target.value)} placeholder="another stock" style={{ padding: '9px 10px', border: '1px solid var(--sg-line-2)', borderRadius: 6, font: 'inherit', minHeight: 44, width: 160 }} />
            <button type="button" disabled={busy || !other.trim()} onClick={() => onAnswer(other.trim(), evidence)} style={btn}>
              Use it
            </button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
            One press: the stock is written to the library as your assertion (with these evidence rows attached), the hold closes, and the line is placed. Next time this product arrives there is no hold.
          </div>
        </>
      ) : row.reason === 'stock_mixed' || row.reason === 'exceeds_capacity' ? (
        <>
          <div style={{ fontSize: 14 }}>
            {row.reason === 'stock_mixed'
              ? "The order can't gang whole because its lines need two stocks. With split when unplaceable on, it goes to one batch per stock and ships when both are done. Andrew's tool held this order forever."
              : 'One line bigger than a batch. With split when unplaceable on, it fills a batch of its own and the remainder goes to the open batch of that stock; either way the shipment is one order and ships when both parts are done.'}
          </div>
          {row.detail ? <div style={{ ...mono, color: 'var(--sg-muted)' }}>{row.detail}</div> : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <button type="button" disabled={busy || !row.unitId || !row.holdId} onClick={onSplitOnce} style={primary} data-testid="split-once" title="This order only; the shop rule below stays as it is">
              {row.reason === 'stock_mixed' ? 'Split by stock' : 'Own batch + the remainder into the open one'}
            </button>
            <button type="button" disabled={busy} style={btn} title="Leaves it held; nothing changes">
              {row.reason === 'stock_mixed' ? 'Keep whole, wait for a 2-stock answer' : 'Leave held'}
            </button>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
              <input type="checkbox" checked={Boolean(settings?.split_when_unplaceable)} disabled={busy || !settings} onChange={(e) => onAlwaysSplit(e.target.checked)} />
              {row.reason === 'stock_mixed' ? 'Always split mixed-stock orders (shop setting)' : 'Always split oversize orders (shop setting)'}
            </label>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 14, color: 'var(--sg-muted)' }}>{row.detail ?? row.clears}</div>
      )}
    </div>
  );
}

/** The shadow_reader's view of the queue itself (dispatch 16 Nov 2026, item 5):
 * every unit with its scan code, entity and open holds, and the holds by
 * reason — what GET /release-units/queue returns, nothing added, no action. */
function ReadOnlyHeld({ entries, byReason }: { entries: HeldQueueEntry[]; byReason: [string, number][] }) {
  return (
    <section style={card} aria-labelledby="held-queue" data-testid="read-only-held">
      <div>
        <h2 id="held-queue" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>The queue, as returned</h2>
        <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
          {entries.length} unit{entries.length === 1 ? '' : 's'} · holds by reason:{' '}
          {byReason.length ? byReason.map(([reason, n]) => `${reason} ${n}`).join(' · ') : 'none'}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr>
              {['Unit', 'Scan code', 'Entity', 'Order', 'State', 'Age', 'Open holds'].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: 12, color: 'var(--sg-muted)', padding: '8px 10px', borderBottom: '1px solid var(--sg-line-3)', textTransform: 'uppercase', letterSpacing: '.02em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.unit_id} data-testid="queue-row">
                <td style={{ ...mono, padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.reference}</td>
                <td style={{ ...mono, padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.scan_code || '—'}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.business_entity ?? '—'}</td>
                <td style={{ ...mono, padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.order_number ?? '—'}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.release_state ?? 'held'}</td>
                <td style={{ ...mono, padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{ageText(e.age_seconds)}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid var(--sg-surface-3)' }}>{e.open_holds.map((h) => h.reason).join(', ') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function HeldPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const [entries, setEntries] = useState<HeldQueueEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [taylor, setTaylor] = useState<TaylorPoolLine[]>([]);
  const [settings, setSettings] = useState<ProductionSettings | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, SpecSuggestion>>({});
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // A shadow_reader (dispatch 16 Nov 2026, item 5) may read the queue, the batches and the pool, nothing else:
  // the orders list, the settings and the suggestions are not fetched for it, and no action is offered.
  const load = useCallback(async () => {
    const [q, o, t] = await Promise.all([listHeldQueue(), readOnly ? Promise.resolve([] as Order[]) : listPrinterOrders(), listTaylorPool().catch(() => [] as TaylorPoolLine[])]);
    setEntries(q);
    setOrders(o);
    setTaylor(t);
  }, [readOnly]);

  useEffect(() => {
    load().catch((e: unknown) => (isNoFloorRole(e) ? setNoRole(true) : setError(loadFailureText(e, 'Could not load the held lines'))));
    if (readOnly) return;
    getProductionSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, [load, readOnly]);

  const lists = useMemo(() => splitHeld(entries, orders, taylor), [entries, orders, taylor]);

  useEffect(() => {
    if (readOnly) return;
    for (const row of lists.needsDecision) {
      if (row.reason === 'stock_unknown' && row.productKey && !(row.productKey in suggestions)) {
        getSpecSuggestion(row.productKey, { portalId: row.portalId, description: row.description })
          .then((s) => setSuggestions((prev) => ({ ...prev, [row.productKey as string]: s })))
          .catch(() => undefined);
      }
    }
  }, [lists.needsDecision, suggestions, readOnly]);

  // Proposals (dispatch 17–18 Nov 2026, item 1): a held unit, or its order, is a target.
  const proposalTargets = useMemo<ProposalTarget[]>(() => {
    const out: ProposalTarget[] = [];
    const seenOrders = new Set<string>();
    for (const e of entries) {
      out.push({ target_kind: 'release_unit', target_id: e.unit_id, label: `${e.kind === 'production' ? 'Unit' : 'Shipment'} ${e.reference}` });
      if (e.source_order_id && !seenOrders.has(e.source_order_id)) {
        seenOrders.add(e.source_order_id);
        out.push({ target_kind: 'order', target_id: e.source_order_id, label: `Order ${e.order_number ?? e.reference}` });
      }
    }
    return out;
  }, [entries]);

  const byReason = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) for (const h of e.open_holds) counts.set(h.reason, (counts.get(h.reason) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries]);

  async function answer(row: HeldRow, stock: string, evidence: StockEvidence[]) {
    if (!row.unitId || !row.holdId) return;
    setBusy(row.key);
    setNotice(null);
    try {
      await clearUnitHold(row.unitId, row.holdId, onePressResolution(stock, evidence));
      setNotice(`${row.order}: stock ${stock} written to the library as your assertion; the hold is closed.`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The answer was refused');
    } finally {
      setBusy(null);
    }
  }

  async function splitOnce(row: HeldRow) {
    if (!row.unitId || !row.holdId) return;
    setBusy(row.key);
    setNotice(null);
    try {
      await splitHoldOnce(row.unitId, row.holdId, { evidence_kind: 'other', evidence_note: `Split once from Held — ${row.reason === 'stock_mixed' ? 'one batch per stock' : 'own batch plus the remainder'}; the shop rule unchanged`, answer: 'split once' });
      setNotice(`${row.order}: split once — its lines are placed; the shop rule is unchanged.`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The split was refused');
    } finally {
      setBusy(null);
    }
  }

  async function alwaysSplit(on: boolean) {
    if (!settings) return;
    setBusy('settings');
    try {
      setSettings(await updateProductionSettings({ ...settings, split_when_unplaceable: on }));
      setNotice(on ? 'Shop setting written: mixed-stock and oversize orders split from now on.' : 'Shop setting written: orders stay whole; the planner holds them.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The setting was refused');
    } finally {
      setBusy(null);
    }
  }

  async function fetchNow(row: HeldRow) {
    setBusy(row.key);
    try {
      const { pullTaylorNow } = await import('../../api/production');
      await pullTaylorNow();
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The pull was refused');
    } finally {
      setBusy(null);
    }
  }

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Held</h1>
        <span style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
          {lists.counts.held} held · {lists.counts.fact} waiting for a fact (clear themselves) · {lists.counts.onYou} waiting on you · {lists.counts.onRule} waiting on a rule
        </span>
      </div>
      {error ? <div role="alert" style={{ color: 'var(--sg-danger)' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: 'var(--sg-muted)' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {notice ? <div role="status" style={{ color: colors.vein }}>{notice}</div> : null}

      {readOnly ? (
        <ReadOnlyHeld entries={entries} byReason={byReason} />
      ) : null}

      <section style={card} aria-labelledby="held-facts">
        <div>
          <h2 id="held-facts" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Waiting for a fact</h2>
          <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>Nobody decides these. They clear the moment the thing arrives; the age is the only thing to watch.</div>
        </div>
        {lists.waitingForFact.length ? lists.waitingForFact.map((row) => <FactRow key={row.key} row={row} readOnly={readOnly} fetching={busy === row.key} onFetchNow={() => fetchNow(row)} />) : <div style={{ color: 'var(--sg-muted)' }}>Nothing is waiting for a fact.</div>}
      </section>

      <section aria-labelledby="held-decisions" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 id="held-decisions" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Needs a decision</h2>
          <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>The facts are known; the shop has to choose. Answer once, or tick "always" and it never asks again.</div>
        </div>
        {lists.needsDecision.length ? (
          lists.needsDecision.map((row) =>
            readOnly ? (
              <div key={row.key} style={card} data-testid={`held-${row.reason}`}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600 }}>{row.title}</span>
                  <span style={mono}>{row.order}</span>
                  <span style={{ color: 'var(--sg-muted)', fontSize: 14 }}>{row.summary} · received {ageText(row.ageSeconds)} ago</span>
                  <span style={{ marginLeft: 'auto' }}>
                    <WaitingPill on={row.waitingOn} />
                  </span>
                </div>
                {row.detail ? <div style={{ ...mono, color: 'var(--sg-muted)' }}>{row.detail}</div> : null}
              </div>
            ) : (
              <DecisionCard key={row.key} row={row} suggestion={row.productKey ? suggestions[row.productKey] ?? null : null} settings={settings} busy={busy === row.key || busy === 'settings'} onAnswer={(stock, evidence) => answer(row, stock, evidence)} onAlwaysSplit={alwaysSplit} onSplitOnce={() => splitOnce(row)} />
            ),
          )
        ) : (
          <div style={{ color: 'var(--sg-muted)' }}>Nothing needs a decision.</div>
        )}
      </section>
      <ProposalsPanel targets={proposalTargets} readOnly={readOnly} />
      <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
        A hold is never silent: each one says who it waits on and how old it is, and anything older than 2 days shows on the staff notices. Answers write back — the library, the shop setting, or the decision on the order — so the same question is not asked twice.
      </div>
    </ProductionLayout>
  );
}
