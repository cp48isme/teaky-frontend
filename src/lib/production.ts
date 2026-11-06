/** Pure helpers for the production screens (day 2, 6 Nov 2026). */

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K;
  direction: SortDirection;
}

/** Sort rows by a key; strings by locale, numbers and dates by value; nulls last. */
export function sortRows<T, K extends keyof T & string>(rows: T[], key: K, direction: SortDirection): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key] as unknown;
    const y = b[key] as unknown;
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
    return String(x).localeCompare(String(y), undefined, { numeric: true }) * sign;
  });
}

/** The next sort state when a header is pressed: a new column starts ascending
 * (Received starts descending — newest first is the question being asked). */
export function nextSort<K extends string>(current: SortState<K>, key: K, descendingFirst: K[] = []): SortState<K> {
  if (current.key !== key) return { key, direction: descendingFirst.includes(key) ? 'desc' : 'asc' };
  return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
}

export type SlotState = 'filled' | 'fill' | 'blank';

/** The 24-slot strip (board 2): filled slots, then the slots the fill advice
 * could fill now, then blanks. Never more than the capacity, never fewer. */
export function slotStrip(used: number, fillable: number, capacity: number): SlotState[] {
  const cap = Math.max(0, capacity);
  const filled = Math.min(Math.max(0, used), cap);
  const fill = Math.min(Math.max(0, fillable), cap - filled);
  const strip: SlotState[] = [];
  for (let i = 0; i < cap; i += 1) {
    strip.push(i < filled ? 'filled' : i < filled + fill ? 'fill' : 'blank');
  }
  return strip;
}

/** Age in the board's words: "11 min", "1 h", "2 d". */
export function ageText(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '';
  const s = Math.max(0, seconds);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `${Math.round(s / 3600)} h`;
  return `${Math.round(s / 86400)} d`;
}

export function ageSeconds(iso: string, now: Date = new Date()): number {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : Math.max(0, Math.round((now.getTime() - t) / 1000));
}

/** "Nov 5 09:12" from an ISO instant, in the browser's zone. */
export function receivedText(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const month = d.toLocaleString('en-US', { month: 'short' });
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${month} ${d.getDate()} ${hh}:${mm}`;
}

/** Slots a line takes: qty × pack ÷ cards-per-slot, never less than one. */
export function slotsFor(cards: number, cardsPerSlot = 250): number {
  return Math.max(1, Math.ceil(Math.max(0, cards) / cardsPerSlot));
}

export function slotRangeText(first: number, last: number): string {
  return last > first ? `${first}–${last}` : `${first}`;
}
