// One search rule for every list (30 Oct 2026, Cause 6): case-insensitive,
// matches a partial string, over the fields the list names. The products grid
// had it first; the orders list uses the same function, not a second one.

/** True when `query` (trimmed, any case) occurs in any of `fields`; an empty query matches everything. */
export function matchesSearch(query: string, fields: ReadonlyArray<string | null | undefined>): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => (field ?? '').toLowerCase().includes(q));
}
