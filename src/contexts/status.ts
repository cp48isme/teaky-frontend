import { createContext } from 'react';

// The status seam (30 Oct 2026, ruling R1). Every mutation in the app reports
// its outcome through one place: a single live region mounted once by
// StatusProvider. Before this the app had no shared seam — alert() in eight
// files for some failures, hand-written per-form strings for others, and
// nothing at all for a cap-refused Add to Cart, a saved RGI number or a saved
// Max packs cell. See useAction for the hook that every mutation goes through.

export type StatusKind = 'success' | 'error';

export interface StatusMessage {
  id: number;
  kind: StatusKind;
  text: string;
}

export interface StatusApi {
  /** What the region shows now. One message at a time: the latest outcome replaces the one before it. */
  message: StatusMessage | null;
  announce: (kind: StatusKind, text: string) => void;
  dismiss: () => void;
}

/** Outside a StatusProvider (a unit test of one page) announcing is a no-op. The app mounts one provider in App.tsx. */
export const noStatus: StatusApi = {
  message: null,
  announce: () => {},
  dismiss: () => {},
};

export const StatusContext = createContext<StatusApi>(noStatus);
