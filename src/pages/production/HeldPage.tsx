import { useCallback, useEffect, useMemo, useState } from 'react';
import { listPrinterOrders } from '../../api/orders';
import { getProductionSettings, getSpecSuggestion, listTaylorPool, updateProductionSettings } from '../../api/production';
import { clearUnitHold, listHeldQueue } from '../../api/releaseUnits';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText } from '../../lib/production';
import { onePressResolution, splitHeld, stockChoices, type HeldRow } from '../../lib/held';
import type { Order } from '../../types/order';
import type { ProductionSettings, SpecSuggestion, StockEvidence, TaylorPoolLine } from '../../types/production';
import type { HeldQueueEntry } from '../../types/releaseUnit';

/** Board 4: Held — the suggestion, one answer. Two lists: "Waiting for a
 * fact" (nobody decides; it clears when the thing arrives) and "Needs a
 * decision" (the facts are known; answer once, or tick "always"). */

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const primary: React.CSSProperties = { ...btn, background: colors.vein, color: '#fff', borderColor: colors.vein };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 };

function WaitingPill({ on }: { on: HeldRow['waitingOn'] }) {
  const hot = on === 'you';
  return <span style={{ ...pill, background: hot ? '#fdebe6' : '#e9ebef', color: hot ? '#a3331d' : '#3f4854' }}>Waiting on: {on === 'you' ? 'you' : on}</span>;
}

function FactRow({ row, onFetchNow, fetching }: { row: HeldRow; onFetchNow: () => void; fetching: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 3fr) 80px 170px', gap: 16, alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid #eef0f3' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{row.title}</div>
        <div style={mono}>{row.order}</div>
        <div style={{ color: '#4b5563', fontSize: 13 }}>{row.summary}</div>
      </div>
      <div style={{ fontSize: 14 }}>{row.detail}</div>
      <div style={{ ...mono, color: row.ageSeconds > 2 * 86400 ? '#a3331d' : undefined }}>{ageText(row.ageSeconds)}</div>
      <div style={{ fontSize: 13, color: '#4b5563' }}>
        {row.clears} ·{' '}
        {row.taylorLineId ? (
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
        <div style={{ gridColumn: '1 / -1', color: '#4b5563' }}>No evidence yet for this product: nothing of the customer's, no matching description, no Docket code.</div>
      )}
    </div>
  );
}

function EvidenceCells({ what, says, stock }: { what: string; says: string; stock: string }) {
  const cell: React.CSSProperties = { padding: '6px 0', borderBottom: '1px solid #eef0f3' };
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
  busy,
}: {
  row: HeldRow;
  suggestion: SpecSuggestion | null;
  settings: ProductionSettings | null;
  onAnswer: (stock: string, evidence: StockEvidence[]) => void;
  onAlwaysSplit: (on: boolean) => void;
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
        <span style={{ color: '#4b5563', fontSize: 14 }}>
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
            <span style={{ color: '#4b5563' }}>or</span>
            <input aria-label="Another stock" value={other} onChange={(e) => setOther(e.target.value)} placeholder="another stock" style={{ padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 160 }} />
            <button type="button" disabled={busy || !other.trim()} onClick={() => onAnswer(other.trim(), evidence)} style={btn}>
              Use it
            </button>
          </div>
          <div style={{ fontSize: 13, color: '#4b5563' }}>
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
          {row.detail ? <div style={{ ...mono, color: '#4b5563' }}>{row.detail}</div> : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <button type="button" disabled title="The planner's one-time split is not wired yet (bead l39y); the shop rule below is" style={{ ...btn, opacity: 0.6 }}>
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
        <div style={{ fontSize: 14, color: '#4b5563' }}>{row.detail ?? row.clears}</div>
      )}
    </div>
  );
}

export default function HeldPage() {
  const [entries, setEntries] = useState<HeldQueueEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [taylor, setTaylor] = useState<TaylorPoolLine[]>([]);
  const [settings, setSettings] = useState<ProductionSettings | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, SpecSuggestion>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [q, o, t] = await Promise.all([listHeldQueue(), listPrinterOrders(), listTaylorPool().catch(() => [] as TaylorPoolLine[])]);
    setEntries(q);
    setOrders(o);
    setTaylor(t);
  }, []);

  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the held lines'));
    getProductionSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
  }, [load]);

  const lists = useMemo(() => splitHeld(entries, orders, taylor), [entries, orders, taylor]);

  useEffect(() => {
    for (const row of lists.needsDecision) {
      if (row.reason === 'stock_unknown' && row.productKey && !(row.productKey in suggestions)) {
        getSpecSuggestion(row.productKey)
          .then((s) => setSuggestions((prev) => ({ ...prev, [row.productKey as string]: s })))
          .catch(() => undefined);
      }
    }
  }, [lists.needsDecision, suggestions]);

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
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Held</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {lists.counts.held} held · {lists.counts.fact} waiting for a fact (clear themselves) · {lists.counts.onYou} waiting on you · {lists.counts.onRule} waiting on a rule
        </span>
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {notice ? <div role="status" style={{ color: colors.vein }}>{notice}</div> : null}

      <section style={card} aria-labelledby="held-facts">
        <div>
          <h2 id="held-facts" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Waiting for a fact</h2>
          <div style={{ color: '#4b5563', fontSize: 14 }}>Nobody decides these. They clear the moment the thing arrives; the age is the only thing to watch.</div>
        </div>
        {lists.waitingForFact.length ? lists.waitingForFact.map((row) => <FactRow key={row.key} row={row} fetching={busy === row.key} onFetchNow={() => fetchNow(row)} />) : <div style={{ color: '#4b5563' }}>Nothing is waiting for a fact.</div>}
      </section>

      <section aria-labelledby="held-decisions" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 id="held-decisions" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Needs a decision</h2>
          <div style={{ color: '#4b5563', fontSize: 14 }}>The facts are known; the shop has to choose. Answer once, or tick "always" and it never asks again.</div>
        </div>
        {lists.needsDecision.length ? (
          lists.needsDecision.map((row) => (
            <DecisionCard key={row.key} row={row} suggestion={row.productKey ? suggestions[row.productKey] ?? null : null} settings={settings} busy={busy === row.key || busy === 'settings'} onAnswer={(stock, evidence) => answer(row, stock, evidence)} onAlwaysSplit={alwaysSplit} />
          ))
        ) : (
          <div style={{ color: '#4b5563' }}>Nothing needs a decision.</div>
        )}
      </section>
      <div style={{ fontSize: 13, color: '#4b5563' }}>
        A hold is never silent: each one says who it waits on and how old it is, and anything older than 2 days shows on the staff notices. Answers write back — the library, the shop setting, or the decision on the order — so the same question is not asked twice.
      </div>
    </ProductionLayout>
  );
}
