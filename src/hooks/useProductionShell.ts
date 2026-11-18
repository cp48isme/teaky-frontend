import { useEffect, useState } from 'react';
import { getProductionShell } from '../api/organizations';
import type { ProductionShell } from '../types/organization';

let cached: ProductionShell | null = null;
let inflight: Promise<ProductionShell | null> | null = null;

/** The production shell's name and mark, fetched once per session (ruling 18
 * Nov 2026): never a constant for every shop. Null while loading or when the
 * read is refused — the shell then shows no name and no mark rather than a
 * wrong one. */
export function loadProductionShell(): Promise<ProductionShell | null> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getProductionShell()
      .then((shell) => {
        cached = shell;
        return shell;
      })
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Forget the cached shell (sign-out, organisation switch, tests). */
export function resetProductionShell(): void {
  cached = null;
  inflight = null;
}

export function useProductionShell(): ProductionShell | null {
  const [shell, setShell] = useState<ProductionShell | null>(cached);
  useEffect(() => {
    let alive = true;
    loadProductionShell().then((loaded) => {
      if (alive) setShell(loaded);
    });
    return () => {
      alive = false;
    };
  }, []);
  return shell;
}
