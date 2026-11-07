import { useEffect, useMemo, useState } from 'react';
import { correctStock, getSpecHistory, listSpecLibrary, markNotBatched } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import type { SpecHistoryEntry, SpecLibraryRow, SpecSource } from '../../types/production';

/** Board 5: Products — evidence and provenance. The spec library's table:
 * a value is never thrown away; a correction supersedes; the table answers
 * "why is this product on this stock?" with a name, a time and the evidence. */

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
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
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

export default function ProductsPage() {
  const [rows, setRows] = useState<SpecLibraryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'all' | SpecSource>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<SpecHistoryEntry[]>([]);
  const [correcting, setCorrecting] = useState<{ value: string; note: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setRows(await listSpecLibrary());
  }
  useEffect(() => {
    load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the library'));
  }, []);
  useEffect(() => {
    if (!selected) return;
    getSpecHistory(selected)
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [selected, rows]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => (source === 'all' || r.source === source) && (!q || r.product_key.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)));
  }, [rows, search, source]);
  const counts = {
    total: rows.length,
    imported: rows.filter((r) => r.source === 'import').length,
    person: rows.filter((r) => r.source === 'person').length,
  };

  async function submitCorrection(key: string) {
    if (!correcting) return;
    setBusy(true);
    setNotice(null);
    try {
      await correctStock(key, correcting.value.trim(), correcting.note.trim());
      setNotice(`${key}: stock ${correcting.value.trim()} written as your assertion; the previous row is kept as history.`);
      setCorrecting(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The correction was refused');
    } finally {
      setBusy(false);
    }
  }
  async function notBatched(key: string) {
    setBusy(true);
    setNotice(null);
    try {
      await markNotBatched(key, 'marked on Products');
      setNotice(`${key}: marked not batched; its stock row is kept as history.`);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The mark was refused');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Products</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>
          {counts.total} products · {counts.imported} from Andrew's table · {counts.person} asserted by a person
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          Search
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="product or stock" style={{ padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 220 }} />
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
              {['Product', 'Stock', 'Source', 'Asserted', 'Evidence agrees?', 'Used', ''].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.product_key} style={selected === r.product_key ? { background: '#f6faf2' } : undefined}>
                <td style={{ ...td, ...mono }}>{r.product_key}</td>
                <td style={{ ...td, ...mono, color: r.not_batched ? '#4b5563' : r.value === 'unknown' ? '#a3331d' : undefined }}>{r.not_batched ? 'not batched' : r.value}</td>
                <td style={td}>
                  <SourcePill source={r.source} />
                </td>
                <td style={td}>
                  {who(r)} · {when(r.asserted_at)}
                </td>
                <td style={td}>{agreementText(r)}</td>
                <td style={td}>{r.prior_units ? `${r.prior_units} lines` : '—'}</td>
                <td style={td}>
                  <button type="button" onClick={() => setSelected(selected === r.product_key ? null : r.product_key)} style={{ all: 'unset', color: colors.vein, cursor: 'pointer' }}>
                    History
                  </button>
                </td>
              </tr>
            ))}
            {!shown.length ? (
              <tr>
                <td colSpan={7} style={{ ...td, color: '#4b5563' }}>
                  No products match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? (
        <section style={card} aria-label={`History of ${selected}`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontWeight: 600 }}>History</span>
            <span style={mono}>{selected}</span>
            <span style={{ color: '#4b5563', fontSize: 14 }}>nothing is deleted; a correction supersedes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 110px minmax(0, 1fr)', gap: '8px 16px', fontSize: 14 }}>
            <div style={lbl}>When</div>
            <div style={lbl}>Stock</div>
            <div style={lbl}>By · evidence shown at the time</div>
            {history.map((h, i) => (
              <HistoryCells key={h.id} entry={h} superseded={i > 0 || Boolean(h.superseded_by)} />
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {correcting ? (
              <>
                <input aria-label="Corrected stock" value={correcting.value} onChange={(e) => setCorrecting({ ...correcting, value: e.target.value })} placeholder="stock, e.g. 100#" style={{ padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 160 }} />
                <input aria-label="Why" value={correcting.note} onChange={(e) => setCorrecting({ ...correcting, note: e.target.value })} placeholder="why (kept with the row)" style={{ padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 320 }} />
                <button type="button" disabled={busy || !correcting.value.trim()} onClick={() => submitCorrection(selected)} style={{ ...btn, background: colors.vein, color: '#fff', borderColor: colors.vein }}>
                  Write the correction
                </button>
                <button type="button" onClick={() => setCorrecting(null)} style={btn}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setCorrecting({ value: '', note: '' })} style={btn}>
                  Correct the stock…
                </button>
                <button type="button" disabled={busy} onClick={() => notBatched(selected)} style={btn}>
                  Mark not batched
                </button>
                <span style={{ fontSize: 13, color: '#4b5563' }}>both under production:rules</span>
              </>
            )}
          </div>
        </section>
      ) : null}
      <div style={{ fontSize: 13, color: '#4b5563' }}>
        This replaces the Products window and the spreadsheet import. A value is never thrown away on import ("100# cream" stays "100# cream" and is flagged, not blanked). The table answers "why is this product on this stock?" with a name, a time and the evidence that was on screen.
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
