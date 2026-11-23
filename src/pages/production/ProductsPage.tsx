import { useEffect, useMemo, useState } from 'react';
import { correctStock, getPressRunConfig, getSpecHistory, listSpecLibrary, markNotBatched } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import type { SpecHistoryEntry, SpecLibraryRow, SpecSource } from '../../types/production';

/** Board 5: Products — the stock rulings screen (a27 item 4, ruling 20 Nov
 * 2026): one row per product, the product and ONE stock dropdown; choosing a
 * stock writes the ruling against the product (a person's assertion; the
 * previous row stays as history); "not batched" is a choice too; the
 * provenance (source, who, when, evidence, history) sits collapsed behind
 * Details. A value is never thrown away; a correction supersedes. */

const SRC: Record<SpecSource, { background: string; color: string; what: string }> = {
  person: { background: '#e6f3ee', color: '#558b2f', what: 'someone answered a hold or edited here' },
  import: { background: '#e9ebef', color: '#3f4854', what: "Andrew's product table" },
  history: { background: '#e3eefb', color: '#1d4e89', what: 'what the product actually ran on' },
  docket: { background: '#fbf1d9', color: '#7a5a12', what: 'a proposal from a Docket item code — never applied on its own' },
};
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#4b5563', padding: '10px 12px', borderBottom: '1px solid #d9dde3', letterSpacing: '.02em', textTransform: 'uppercase', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '11px 12px', borderBottom: '1px solid #e6e9ee', fontSize: 14, verticalAlign: 'top' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const lbl: React.CSSProperties = { fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em' };

export function SourcePill({ source }: { source: SpecSource }) {
  const s = SRC[source] ?? SRC.import;
  return (
    <span title={s.what} style={{ ...pill, background: s.background, color: s.color }}>
      {source}
    </span>
  );
}

function when(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

function who(row: { asserted_by: string | null; source: SpecSource }): string {
  if (row.source === 'import') return "Andrew's table";
  if (row.source === 'history') return 'the batches';
  if (row.source === 'docket') return 'Docket';
  return row.asserted_by ?? 'a person';
}

export function agreementText(row: SpecLibraryRow): string {
  if (row.not_batched) return '—';
  if (row.agrees === null) return '—';
  return row.agrees ? `yes · ${row.prior_units} lines` : `no · ${row.prior_units} lines ran on another stock`;
}

const RULED_NOTE = 'ruled on Products';
const NOT_BATCHED = 'not batched';

export function stockOptions(rows: SpecLibraryRow[], shopStocks: string[]): string[] {
  const seen = new Set<string>();
  for (const s of shopStocks) if (s.trim()) seen.add(s.trim());
  for (const r of rows) if (r.value && r.value !== 'unknown' && !r.not_batched) seen.add(r.value);
  return Array.from(seen).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

export function currentChoice(r: SpecLibraryRow): string {
  if (r.not_batched) return NOT_BATCHED;
  return r.value && r.value !== 'unknown' ? r.value : '';
}

export default function ProductsPage() {
  const [rows, setRows] = useState<SpecLibraryRow[]>([]);
  const [shopStocks, setShopStocks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'all' | SpecSource>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<Record<string, SpecHistoryEntry[]>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setRows(await listSpecLibrary());
  }
  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the library'));
    getPressRunConfig()
      .then((c) => setShopStocks(Object.keys(c.docket_item_codes ?? {})))
      .catch(() => setShopStocks([]));
  }, []);

  const options = useMemo(() => stockOptions(rows, shopStocks), [rows, shopStocks]);
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => (source === 'all' || r.source === source) && (!q || r.product_key.toLowerCase().includes(q) || (r.product_name ?? '').toLowerCase().includes(q) || r.value.toLowerCase().includes(q)));
  }, [rows, search, source]);
  const counts = {
    total: rows.length,
    unknown: rows.filter((r) => !r.not_batched && (!r.value || r.value === 'unknown')).length,
    person: rows.filter((r) => r.source === 'person').length,
  };

  async function toggle(key: string) {
    const next = !open[key];
    setOpen((o) => ({ ...o, [key]: next }));
    if (next && !history[key]) {
      try {
        setHistory((h) => ({ ...h, [key]: [] }));
        const entries = await getSpecHistory(key);
        setHistory((h) => ({ ...h, [key]: entries }));
      } catch {
        setHistory((h) => ({ ...h, [key]: [] }));
      }
    }
  }

  async function rule(key: string, choice: string) {
    if (choice === '') return; // "unknown" is not a ruling; the row stays as it is
    setBusy(key);
    setNotice(null);
    setError(null);
    try {
      if (choice === NOT_BATCHED) {
        await markNotBatched(key, RULED_NOTE);
        setNotice(`${key}: not batched — recorded against the product; the previous row is kept as history.`);
      } else {
        await correctStock(key, choice, RULED_NOTE);
        setNotice(`${key}: stock ${choice} — recorded against the product as your ruling; the previous row is kept as history.`);
      }
      setHistory((h) => ({ ...h, [key]: undefined as unknown as SpecHistoryEntry[] }));
      await load();
    } catch (e: unknown) {
      setError(`${key}: ${e instanceof Error ? e.message : 'the ruling was refused'}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Products</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {counts.total} products · {counts.unknown} without a stock · {counts.person} ruled by a person
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          Search
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="product name, code or stock" style={{ padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 220 }} />
        </label>
        <span style={{ fontSize: 14 }}>Source:</span>
        {(['all', 'person', 'import', 'history', 'docket'] as const).map((s) => (
          <button key={s} type="button" onClick={() => setSource(s)} aria-pressed={source === s} style={{ ...btn, minHeight: 36, padding: '6px 12px', borderColor: source === s ? colors.vein : '#c9cfd6', color: source === s ? colors.vein : undefined }} title={s === 'all' ? 'every source' : SRC[s].what}>
            {s}
          </button>
        ))}
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {notice ? <div role="status" style={{ color: colors.vein }}>{notice}</div> : null}
      <div style={{ background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {['Product', 'Stock', ''].map((h) => (
                <th key={h || 'details'} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <>
                <tr key={r.product_key} data-testid="product-row" style={open[r.product_key] ? { background: '#f6faf2' } : undefined}>
                  <td style={td}>
                    {/* Item 3 (23 Nov 2026, ruling: product name plus one dropdown): the name as the channel describes it, the code beneath. */}
                    {r.product_name ? (
                      <>
                        <div data-testid="product-name">{r.product_name}</div>
                        <div style={{ ...mono, fontSize: 12, color: '#4b5563' }}>{r.product_key}</div>
                      </>
                    ) : (
                      <div style={mono}>{r.product_key}</div>
                    )}
                  </td>
                  <td style={td}>
                    <select
                      aria-label={`Stock for ${r.product_key}`}
                      value={currentChoice(r)}
                      disabled={busy === r.product_key}
                      onChange={(e) => rule(r.product_key, e.target.value)}
                      style={{ padding: '7px 10px', border: '1px solid #c9cfd6', borderRadius: 6, background: '#fff', font: 'inherit', minHeight: 40, color: currentChoice(r) === '' ? '#a3331d' : undefined }}
                    >
                      <option value="">unknown — choose a stock</option>
                      {options.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value={NOT_BATCHED}>{NOT_BATCHED}</option>
                    </select>
                  </td>
                  <td style={td}>
                    <button type="button" aria-expanded={Boolean(open[r.product_key])} aria-label={`Details of ${r.product_key}`} onClick={() => toggle(r.product_key)} style={{ all: 'unset', color: colors.vein, cursor: 'pointer' }}>
                      {open[r.product_key] ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {open[r.product_key] ? (
                  <tr key={`${r.product_key}-details`} data-testid="product-details">
                    <td colSpan={3} style={{ ...td, background: '#fbfcfa' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', fontSize: 14, marginBottom: 10 }}>
                        <span>
                          <span style={lbl}>Source</span> <SourcePill source={r.source} />
                        </span>
                        <span>
                          <span style={lbl}>Asserted</span> {who(r)} · {when(r.asserted_at)}
                        </span>
                        <span>
                          <span style={lbl}>Evidence agrees?</span> {agreementText(r)}
                        </span>
                        <span>
                          <span style={lbl}>Used</span> {r.prior_units ? `${r.prior_units} lines` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '150px 110px minmax(0, 1fr)', gap: '6px 16px', fontSize: 14 }}>
                        <div style={lbl}>When</div>
                        <div style={lbl}>Stock</div>
                        <div style={lbl}>By · evidence shown at the time</div>
                        {(history[r.product_key] ?? []).map((h, i) => (
                          <HistoryCells key={h.id} entry={h} superseded={i > 0 || Boolean(h.superseded_by)} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </>
            ))}
            {!shown.length ? (
              <tr>
                <td colSpan={3} style={{ ...td, color: '#4b5563' }}>
                  No products match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 13, color: '#4b5563' }}>
        Choosing a stock records your ruling against the product; nothing is thrown away — the previous row stays as history behind Details. "not batched" keeps the product on the hotel path.
      </div>
    </ProductionLayout>
  );
}

function HistoryCells({ entry, superseded }: { entry: SpecHistoryEntry; superseded: boolean }) {
  const cell: React.CSSProperties = { padding: '6px 0', borderBottom: '1px solid #eef0f3', color: superseded ? '#4b5563' : undefined };
  const evidence = entry.evidence.map((e) => `${e.kind}: ${e.stock} — ${e.detail}`).join('; ');
  return (
    <>
      <div style={cell}>{when(entry.asserted_at)}</div>
      <div style={{ ...cell, ...mono }}>{entry.attribute === 'batched' ? 'not batched' : entry.value}</div>
      <div style={cell}>
        <SourcePill source={entry.source} /> {who(entry)}
        {evidence ? ` · "${evidence}"` : ' · no evidence attached'}
        {superseded ? ' · superseded' : ''}
      </div>
    </>
  );
}
