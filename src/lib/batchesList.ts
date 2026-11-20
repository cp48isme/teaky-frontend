import type { BatchSummary } from '../types/production';

/** The list view's pure helpers (a26, 18 Nov 2026): the row's words and the sort. */
export type SortKey = 'batch' | 'stock' | 'slots' | 'orders' | 'oldest' | 'state';


export function stateText(b: BatchSummary): string {
  if (b.cancelled) return 'cancelled';
  if (b.marked_done_at) return `marked done · ${new Date(b.marked_done_at).toLocaleDateString()}`;
  if (b.docket_number) return `pushed out · Docket ${b.docket_number}`;
  if (b.release_state === 'released') return 'released';
  if (b.release_state === 'releasing') return 'releasing';
  return 'open';
}

export function slotsText(b: BatchSummary): string {
  const base = `${b.used} / ${b.capacity}`;
  if (b.full) return `${base} · full`;
  if (b.half) return `${base} · half`;
  if (b.blanks) return `${base} · ${b.blanks} blank if pushed out now`;
  return base;
}

export function sortBatches(rows: BatchSummary[], key: SortKey, direction: 'asc' | 'desc'): BatchSummary[] {
  const sign = direction === 'asc' ? 1 : -1;
  const value = (b: BatchSummary): number | string => {
    switch (key) {
      case 'batch':
        return b.batch_number ?? 0;
      case 'stock':
        return b.stock;
      case 'slots':
        return b.capacity ? b.used / b.capacity : 0;
      case 'orders':
        return b.orders;
      case 'oldest':
        return b.oldest_line_age_seconds ?? -1;
      default:
        return stateText(b);
    }
  };
  return [...rows].sort((a, b) => {
    const va = value(a);
    const vb = value(b);
    if (va === vb) return 0;
    return (va < vb ? -1 : 1) * sign;
  });
}

