import { useEffect, useState } from 'react';
import { currentUserId } from './roles';

/** Dark mode for the production floor (ruling 20 Nov 2026, rev 47): the floor
 * follows the system setting, with a per-user choice kept in this browser —
 * `system` (the default), `light` or `dark`. The admin shell is untouched this
 * rev: the tokens live on the floor's root element, not on <html>. */

export type ThemePreference = 'system' | 'light' | 'dark';

const KEY_PREFIX = 'teaky.floor.theme';

function keyFor(): string {
  return `${KEY_PREFIX}.${currentUserId() ?? 'anonymous'}`;
}

export function readThemePreference(): ThemePreference {
  try {
    const value = localStorage.getItem(keyFor());
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') localStorage.removeItem(keyFor());
    else localStorage.setItem(keyFor(), preference);
  } catch {
    // The browser refused storage: the choice lasts this page only.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export const THEME_EVENT = 'teaky:floor-theme';

/** The preference, live: every mount reads the same value and hears a change. */
export function useThemePreference(): [ThemePreference, (next: ThemePreference) => void] {
  const [preference, setPreference] = useState<ThemePreference>(() => readThemePreference());
  useEffect(() => {
    const sync = () => setPreference(readThemePreference());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);
  return [preference, writeThemePreference];
}

/** What the root element carries: nothing for "system" (the media query
 * decides), or the explicit choice. */
export function themeAttribute(preference: ThemePreference): 'light' | 'dark' | undefined {
  return preference === 'system' ? undefined : preference;
}
