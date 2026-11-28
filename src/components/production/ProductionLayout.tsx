import type { ReactNode } from 'react';
import AuthedImage from '../ui/AuthedImage';
import { Link, NavLink } from 'react-router-dom';
import AccountMenu from '../layout/AccountMenu';
import SiteFooter from '../layout/SiteFooter';
import HelpLink from '../layout/HelpLink';
import { isShadowReader } from '../../lib/roles';
import { useProductionShell } from '../../hooks/useProductionShell';
import { themeAttribute, useThemePreference } from '../../lib/theme';

/** The production side's shell (canvas boards 1–5, 5–6 Nov 2026): the
 * co-branded header and the teak sidebar with the production vocabulary —
 * orders, batches, held, products, floor. The mark and the name are the
 * signed-in organisation's (ruling 18 Nov 2026, from the +shadowprobe walk):
 * the shop's own mark with "Powered by Teaky" beside it, or Teaky's own mark
 * alone when the shop has none; nothing is shown while they load. */

const TEAKY_WORDMARK = '/production/teaky-wordmark-white.png';

const INK = '#1c1917'; // the header and nav stay brand-dark on both themes
const LEAF = '#7cb342';
const TEAK = '#a0693c';
const STEM = '#5d4037';

const NAV: { to: string; label: string; built: boolean }[] = [
  { to: '/production/orders', label: 'All Channel Orders', built: true },
  { to: '/production/batches', label: 'Batches', built: true },
  { to: '/production/held', label: 'Held', built: true },
  { to: '/production/stocked-goods', label: 'Stocked goods', built: true },
  { to: '/production/products', label: 'Products', built: true },
  { to: '/production/floor', label: 'Floor', built: true },
  // Navigation 1c (28 Nov 2026): the production settings are Settings → Floor in the one hub (the avatar menu's Settings).
];

/** The read-only shell (dispatch 16 Nov 2026, item 5): a shadow_reader sees
 * All Channel Orders, Batches and Held — what the three routes it may read
 * return — and no action anywhere. */
const READ_ONLY_NAV = new Set(['/production/orders', '/production/batches', '/production/held']);

export default function ProductionLayout({ children, footnote, readOnly = isShadowReader() }: { children: ReactNode; footnote?: string; readOnly?: boolean }) {
  const nav = readOnly ? NAV.filter((item) => READ_ONLY_NAV.has(item.to)) : NAV;
  const shell = useProductionShell();
  // Dark mode (ruling 20 Nov 2026, rev 47): the floor follows the system setting with a per-user choice.
  const [theme] = useThemePreference();
  const teakysOwn = shell !== null && shell.mark.source === 'teaky';
  return (
    <div className="production-root" data-theme={themeAttribute(theme)} data-testid="production-root" style={{ minHeight: '100vh', background: 'var(--sg-page)', color: 'var(--sg-ink)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: '10px 24px', background: INK, borderBottom: `3px solid ${LEAF}` }}
      >
        {shell === null ? (
          <div style={{ height: 44 }} data-testid="shell-loading" />
        ) : (
          // Walk t09 (20 Nov 2026): the mark is the way home — the dashboard for staff, Batches for a read-only reader.
          <Link to={readOnly ? '/production/batches' : '/dashboard'} style={{ display: 'block' }} data-testid="shell-mark-link">
            {teakysOwn ? (
              <img src={TEAKY_WORDMARK} alt="Teaky" style={{ height: 36, width: 'auto', display: 'block' }} data-testid="shell-mark" data-source="teaky" />
            ) : (
              <AuthedImage src={shell.mark.url} alt={shell.mark.alt} style={{ height: 44, width: 'auto', display: 'block' }} data-testid="shell-mark" data-source={shell.mark.source} />
            )}
          </Link>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          {shell !== null && !teakysOwn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#cfc9c2' }} data-testid="powered-by">
              Powered by <img src={TEAKY_WORDMARK} alt="Teaky" style={{ height: 30, width: 'auto', display: 'block' }} />
            </div>
          ) : null}
          {/* Navigation (28 Nov 2026, kkqk 1a): the header link to the shop side, and the "?" to the manual. */}
          {!readOnly ? (
            <Link to="/dashboard" style={{ color: '#f5f0e8', fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 999, padding: '6px 12px' }} data-testid="to-admin-link">
              ← Shop admin
            </Link>
          ) : null}
          <HelpLink onDark />
          {/* The same account menu as the admin shell (dispatch 19 Nov 2026);
              Settings is staff's, a read-only reader gets Account and Sign out. */}
          <AccountMenu showSettings={!readOnly} onDark />
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 'calc(100vh - 67px)' }}>
        <nav
          aria-label="Production"
          style={{ flex: '0 0 200px', background: TEAK, color: 'var(--sg-paper-2)', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <div style={{ padding: '0 20px 20px', fontWeight: 600, color: 'var(--sg-surface)', fontSize: 15, minHeight: 38 }} data-testid="shell-name">
            {shell?.name ?? ''}
          </div>
          {!readOnly ? (
            <NavLink to="/dashboard" style={{ display: 'block', padding: '10px 20px', color: 'var(--sg-line-2)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 6 }} data-testid="dashboard-link">
              ← Dashboard
            </NavLink>
          ) : null}
          {nav.map((item) =>
            item.built ? (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px 20px',
                  color: isActive ? 'var(--sg-surface)' : 'var(--sg-line-2)',
                  background: isActive ? STEM : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: 'none',
                })}
              >
                {item.label}
              </NavLink>
            ) : (
              <span key={item.to} aria-disabled="true" title="Not built yet" style={{ display: 'block', padding: '10px 20px', color: 'var(--sg-paper-line)', opacity: 0.7 }}>
                {item.label}
              </span>
            ),
          )}
          {readOnly ? (
            <div data-testid="read-only-note" style={{ padding: '10px 20px', color: 'var(--sg-paper-line)', fontSize: 13 }}>
              Read-only view
            </div>
          ) : null}
          {footnote ? <div style={{ padding: '10px 20px', color: 'var(--sg-paper-line)', fontSize: 13, marginTop: 'auto' }}>{footnote}</div> : null}
          <NavLink to="/account" style={{ display: 'block', padding: '10px 20px', color: 'var(--sg-line-2)', textDecoration: 'none', marginTop: footnote ? 0 : 'auto' }} data-testid="account-link">
            Account · sign out
          </NavLink>
        </nav>
        <main style={{ flex: '999 1 560px', minWidth: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}

/** The floor's colours as tokens (dark mode, 23 Nov 2026): every screen reads these; the dark block in index.css redefines them. */
export const colors = { ink: 'var(--sg-ink)', leaf: 'var(--sg-brand-leaf)', teak: 'var(--sg-brand-teak)', stem: 'var(--sg-brand-stem)', vein: 'var(--sg-ok)' };
