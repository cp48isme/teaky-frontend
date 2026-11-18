/** The Batches page's view (a26, 18 Nov 2026): the shop's default from its
 * production settings (cards unless set), overridden by this browser's own
 * toggle, remembered in localStorage. RGI's cards are untouched: the default
 * is cards, and the toggle is per browser. */

export type ProductionView = 'cards' | 'list';

const KEY = 'teaky.production.view';

export function readViewPreference(): ProductionView | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'cards' || v === 'list' ? v : null;
  } catch {
    return null;
  }
}

export function writeViewPreference(view: ProductionView): void {
  try {
    localStorage.setItem(KEY, view);
  } catch {
    // a private window; the choice lasts the page
  }
}

export function resolveView(shopDefault: ProductionView | null | undefined, browser: ProductionView | null): ProductionView {
  return browser ?? shopDefault ?? 'cards';
}
