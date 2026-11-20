import { Link, useNavigate } from 'react-router-dom';
import type { BatchSummary } from '../../types/production';
import { ageText } from '../../lib/production';
import { colors } from './ProductionLayout';
import { sortBatches, slotsText, stateText, type SortKey } from '../../lib/batchesList';
import BatchTagEditor from './BatchTagEditor';

/** The list form of the batches (a26, 18 Nov 2026; design
 * production-list-view-2026-11-18): one row per batch, the same facts as the
 * cards — batch, scan code, stock, slots, orders · lines, oldest line,
 * entity, tags, state — sortable by header. For staff the whole row opens
 * the batch (its push-out page; t05, 19 Nov 2026 — the design note said so,
 * rev 44 shipped the number alone), the batch number staying a real link for
 * the keyboard and a new tab; a read-only reader gets no link and no action. */

const th: React.CSSProperties = { textAlign: 'left', fontSize: 12, color: '#4b5563', padding: '8px 10px', borderBottom: '1px solid #d9dde3', textTransform: 'uppercase', letterSpacing: '.02em', cursor: 'pointer', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '10px 10px', borderBottom: '1px solid #eceff2', fontSize: 14, verticalAlign: 'top' };
const mono: React.CSSProperties = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

const HEADERS: { key: SortKey | null; label: string }[] = [
  { key: 'batch', label: 'Batch' },
  { key: null, label: 'Scan code' },
  { key: 'stock', label: 'Stock' },
  { key: 'slots', label: 'Slots' },
  { key: 'orders', label: 'Orders · lines' },
  { key: 'oldest', label: 'Oldest line' },
  { key: null, label: 'Entity' },
  { key: null, label: 'Tags' },
  { key: 'state', label: 'State' },
];

export default function BatchesTable({
  batches,
  readOnly,
  sort,
  onSort,
  shopTags = [],
  onTagsWritten = () => {},
  emptyText = 'No batches to show.',
}: {
  batches: BatchSummary[];
  readOnly: boolean;
  sort: { key: SortKey; direction: 'asc' | 'desc' };
  onSort: (key: SortKey) => void;
  /** The shop's tag list for the row editor (ruling 19 Nov 2026: a bulk action over the batch's orders). */
  shopTags?: readonly string[];
  /** After a bulk write: the page re-reads the batches. */
  onTagsWritten?: () => void;
  /** Walk t09 (20 Nov 2026): the page names the search when it empties the list. */
  emptyText?: string;
}) {
  const rows = sortBatches(batches, sort.key, sort.direction);
  const navigate = useNavigate();
  return (
    <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8 }} data-testid="batches-table">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                style={{ ...th, cursor: h.key ? 'pointer' : 'default' }}
                onClick={h.key ? () => onSort(h.key as SortKey) : undefined}
                aria-sort={h.key && sort.key === h.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {h.label}
                {h.key && sort.key === h.key ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const pct = b.capacity ? Math.round((b.used / b.capacity) * 100) : 0;
            return (
              <tr
                key={b.unit_id}
                data-testid="batch-row"
                title={readOnly ? undefined : 'Open batch'}
                style={readOnly ? undefined : { cursor: 'pointer' }}
                onClick={readOnly ? undefined : (e) => { if ((e.target as HTMLElement).closest('a, button, input, select')) return; navigate(`/production/batches/${b.unit_id}/push-out`); }}
              >
                <td style={{ ...td, ...mono, fontWeight: 600 }}>
                  {readOnly ? (
                    b.batch_number
                  ) : (
                    <Link to={`/production/batches/${b.unit_id}/push-out`} style={{ color: colors.stem }}>
                      {b.batch_number}
                    </Link>
                  )}
                </td>
                <td style={{ ...td, ...mono }}>{b.scan_code ?? ''}</td>
                <td style={td}>{b.stock}</td>
                <td style={td}>
                  <div>{slotsText(b)}</div>
                  <div style={{ marginTop: 4, height: 6, width: 60, background: '#e5e7eb', borderRadius: 3 }} aria-hidden="true">
                    <div style={{ height: 6, width: `${pct}%`, background: colors.leaf, borderRadius: 3 }} />
                  </div>
                </td>
                <td style={td}>{b.orders} · {b.lines}</td>
                <td style={td}>
                  {b.oldest_line_age_seconds != null ? ageText(b.oldest_line_age_seconds) : '—'}
                  {b.oldest_line_ref ? <span style={{ ...mono, marginLeft: 6, color: '#a3331d' }}>{b.oldest_line_ref}</span> : null}
                </td>
                <td style={td}>{(b.business_entities ?? []).join(', ')}</td>
                <td style={td}>{readOnly ? (b.tags ?? []).join(', ') : <BatchTagEditor batch={b} options={shopTags} onWritten={onTagsWritten} />}</td>
                <td style={td}>{stateText(b)}</td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td style={td} colSpan={HEADERS.length} data-testid="no-batches">{emptyText}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
