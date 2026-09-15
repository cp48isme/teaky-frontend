/** Money helpers. API money fields arrive as JSON numbers; be tolerant of strings. */
export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return '-';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Percent fields (margin_percent) arrive as decimal strings like "200.00". */
export function formatPercent(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-';
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return '-';
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
}
