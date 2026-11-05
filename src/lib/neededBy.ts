/**
 * The buyer's wanted-by date ("When do you need these by?"), optional.
 * Stored and sent as YYYY-MM-DD; shown to staff as MM/DD/YYYY. Parsed by
 * hand so a date never shifts by a day through the browser's timezone.
 *
 * "Today" is the shop's today (bead fga1, ruling 4 Nov 2026): the picker's
 * minimum is the calendar date in the shop's timezone — the public portal
 * response carries it — never the browser's day, so the picker and the
 * route refuse the same dates.
 */
export function todayIsoDate(shopTimeZone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: shopTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function formatNeededBy(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[2]}/${match[3]}/${match[1]}`;
}
