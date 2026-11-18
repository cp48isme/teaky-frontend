import type { WhereaboutsUnit } from '../types/whereabouts';

/** The words the whereabouts page uses for a unit's place and state. */

export function locationText(unit: WhereaboutsUnit): string {
  const l = unit.location;
  if (l.state === 'at') return `at ${l.position} ${l.step}`;
  if (l.state === 'out') return `out to ${l.position} ${l.step}`;
  if (l.state === 'next') return `next: ${l.position} ${l.step}`;
  if (l.state === 'done') return 'route finished';
  return unit.kind === 'production' ? 'no route yet' : '—';
}

export function unitStateText(unit: WhereaboutsUnit): string {
  if (unit.cancelled_at) return 'cancelled';
  if (unit.docket_number) return `pushed out · Docket ${unit.docket_number}`;
  if (unit.release_state === 'released') return 'pushed out';
  if (unit.release_state === 'needs_human') return 'needs a person';
  if (unit.release_state === 'retryable') return 'push failed';
  if (unit.release_state === 'releasing') return 'pushing out…';
  if (unit.holds.some((h) => !h.cleared_at)) return 'held';
  return unit.kind === 'production' ? 'open' : 'waiting';
}
