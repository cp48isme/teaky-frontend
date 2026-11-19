import { ApiError } from '../api/client';

/** The production screens' answer to a 403 (walk of 19 Nov 2026): the API
 * refused the read because the signed-in member does not hold the floor role
 * on this shop — not an error to print; the empty state and one line. */
export const NO_FLOOR_ROLE = "You don't have the floor role on this shop.";

export function isNoFloorRole(e: unknown): boolean {
  return e instanceof ApiError && e.status === 403;
}

export function loadFailureText(e: unknown, fallback: string): string {
  return e instanceof Error ? e.message : fallback;
}
