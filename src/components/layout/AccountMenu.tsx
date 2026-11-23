import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../../api/auth';
import { useOptionalAuth } from '../../contexts/AuthContext';
import { initialsFor, labelFor, signedInIdentity, type SignedInIdentity } from '../../lib/identity';
import { loadCurrentUser } from '../../lib/currentUser';
import { useThemePreference, type ThemePreference } from '../../lib/theme';
import type { MeResponse } from '../../types/auth';

/** The account menu both shells share (dispatch 19 Nov 2026): the avatar with
 * the person's initials; the menu names the person — from GET /auth/me (the
 * source; read once per sign-in), with the browser's own record of the
 * sign-in as the fallback only while that request is in flight or has
 * failed — never the user id. It offers Account, Settings (staff only where
 * the shell says so) and Sign out, which ends the session on the server at
 * once (#272) and clears this browser. */
export default function AccountMenu({ showSettings = true, onDark = false }: { showSettings?: boolean; onDark?: boolean }) {
  const auth = useOptionalAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    let cancelled = false;
    const pending = loadCurrentUser();
    if (pending === null) return;
    pending.then(
      (answer) => {
        if (!cancelled) setMe(answer);
      },
      () => {
        // The fallback stands; nothing to do.
      },
    );
    return () => {
      cancelled = true;
    };
    // Walk of rev 46 (23 Nov 2026, t10 a): read again when the session becomes
    // ready or changes, so a shell mounted before the silent refresh answered
    // still shows the person, not the fallback.
  }, [auth?.ready, auth?.authenticated]);
  // Dark mode (rev 47): the floor's per-user theme — shown where the menu sits on the floor (onDark).
  const [theme, setTheme] = useThemePreference();
  const identity: SignedInIdentity = me
    ? { email: me.email, displayName: me.display_name }
    : signedInIdentity();
  const label = labelFor(identity);
  const initials = initialsFor(identity);

  const handleLogout = async () => {
    setOpen(false);
    // Through the provider when there is one (it flips the guarded routes);
    // the API's own sign-out otherwise.
    await (auth ? auth.logout() : apiLogout());
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative" data-testid="account-menu">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label ? `Account menu for ${label}` : 'Account menu'}
        className={
          onDark
            ? 'flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-teak-dark ring-2 ring-white/70 transition hover:bg-stone-100'
            : 'flex h-8 w-8 items-center justify-center rounded-full bg-teak-dark text-xs font-semibold text-white transition hover:bg-teak'
        }
        title={label}
        data-testid="account-avatar"
      >
        {initials}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-gray-100 bg-white py-1 text-left shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="truncate text-sm font-medium text-brand-dark" data-testid="account-menu-name">
              {label || 'Signed in'}
            </p>
            {identity.displayName && identity.email ? (
              <p className="truncate text-xs text-gray-500" data-testid="account-menu-email">
                {identity.email}
              </p>
            ) : null}
          </div>
          <Link to="/account" role="menuitem" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            Account
          </Link>
          {onDark ? (
            <div className="border-t border-gray-100 px-4 py-2" data-testid="theme-control">
              <p className="text-xs uppercase tracking-wide text-gray-500">Theme</p>
              <div className="mt-1 flex gap-1" role="radiogroup" aria-label="Theme">
                {(['system', 'light', 'dark'] as ThemePreference[]).map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    role="radio"
                    aria-checked={theme === choice}
                    onClick={() => setTheme(choice)}
                    className={`rounded px-2 py-1 text-xs ${theme === choice ? 'bg-teak-dark text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    data-testid={`theme-${choice}`}
                  >
                    {choice === 'system' ? 'System' : choice === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {showSettings ? (
            <Link to="/settings/team" role="menuitem" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
              Settings
            </Link>
          ) : null}
          <button type="button" role="menuitem" onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
