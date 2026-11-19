/** The production search's match (t05, 19 Nov 2026): a case-insensitive
 * substring over the given fields; blank matches everything. */
export function matchesSearch(needle: string, fields: Array<string | number | null | undefined>): boolean {
  const q = needle.trim().toLowerCase();
  if (!q) return true;
  return fields.some((v) => v != null && String(v).toLowerCase().includes(q));
}
