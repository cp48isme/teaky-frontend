import type { CSSProperties } from 'react';

/** The one search bar of the production pages (t05, 19 Nov 2026): the same
 * place in the head row, the same words and behaviour on Orders and on
 * Batches — a plain substring match over the row's visible fields, no
 * request. */
const input: CSSProperties = { padding: '7px 10px', border: '1px solid var(--sg-line-2)', borderRadius: 6, background: 'var(--sg-surface)', font: 'inherit', flex: 1 };

export default function ProductionSearch({ value, onChange, placeholder = 'PO, product, any field' }: { value: string; onChange: (next: string) => void; placeholder?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, flex: '1 1 220px' }}>
      <span style={{ whiteSpace: 'nowrap' }}>Search</span>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={input} data-testid="production-search" />
    </label>
  );
}
