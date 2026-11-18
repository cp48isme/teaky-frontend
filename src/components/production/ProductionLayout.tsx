import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SiteFooter from '../layout/SiteFooter';
import { isShadowReader } from '../../lib/roles';
import { useProductionShell } from '../../hooks/useProductionShell';

/** The production side's shell (canvas boards 1–5, 5–6 Nov 2026): the
 * co-branded header and the teak sidebar with the production vocabulary —
 * orders, batches, held, products, floor. The mark and the name are the
 * signed-in organisation's (ruling 18 Nov 2026, from the +shadowprobe walk):
 * the shop's own mark with "Powered by Teaky" beside it, or Teaky's own mark
 * alone when the shop has none; nothing is shown while they load. */

const TEAKY_WORDMARK = '/production/teaky-wordmark-white.png';

const INK = '#1c1917';
const LEAF = '#7cb342';
const TEAK = '#a0693c';
const STEM = '#5d4037';

const NAV: { to: string; label: string; built: boolean }[] = [
  { to: '/production/orders', label: 'All Channel Orders', built: true },
  { to: '/production/batches', label: 'Batches', built: true },
  { to: '/production/held', label: 'Held', built: true },
  { to: '/production/products', label: 'Products', built: true },
  { to: '/production/floor', label: 'Floor', built: true },
  { to: '/production/settings', label: 'Settings', built: true },
];

/** The read-only shell (dispatch 16 Nov 2026, item 5): a shadow_reader sees
 * All Channel Orders, Batches and Held — what the three routes it may read
 * return — and no action anywhere. */
const READ_ONLY_NAV = new Set(['/production/orders', '/production/batches', '/production/held']);

export default function ProductionLayout({ children, footnote, readOnly = isShadowReader() }: { children: ReactNode; footnote?: string; readOnly?: boolean }) {
  const nav = readOnly ? NAV.filter((item) => READ_ONLY_NAV.has(item.to)) : NAV;
  const shell = useProductionShell();
  const teakysOwn = shell !== null && shell.mark.source === 'teaky';
  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', color: INK, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
              <img src={shell.mark.url} alt={shell.mark.alt} style={{ height: 44, width: 'auto', display: 'block' }} data-testid="shell-mark" data-source={shell.mark.source} />
            )}
          </Link>
        )}
        {shell !== null && !teakysOwn ? (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#cfc9c2' }} data-testid="powered-by">
            Powered by <img src={TEAKY_WORDMARK} alt="Teaky" style={{ height: 30, width: 'auto', display: 'block' }} />
          </div>
        ) : null}
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 'calc(100vh - 67px)' }}>
        <nav
          aria-label="Production"
          style={{ flex: '0 0 200px', background: TEAK, color: '#f6ede0', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <div style={{ padding: '0 20px 20px', fontWeight: 600, color: '#fff', fontSize: 15, minHeight: 38 }} data-testid="shell-name">
            {shell?.name ?? ''}
          </div>
          {!readOnly ? (
            <NavLink to="/dashboard" style={{ display: 'block', padding: '10px 20px', color: '#d7dbe0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 6 }} data-testid="dashboard-link">
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
                  color: isActive ? '#fff' : '#d7dbe0',
                  background: isActive ? STEM : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: 'none',
                })}
              >
                {item.label}
              </NavLink>
            ) : (
              <span key={item.to} aria-disabled="true" title="Not built yet" style={{ display: 'block', padding: '10px 20px', color: '#e9d9c6', opacity: 0.7 }}>
                {item.label}
              </span>
            ),
          )}
          {readOnly ? (
            <div data-testid="read-only-note" style={{ padding: '10px 20px', color: '#f0e2cf', fontSize: 13 }}>
              Read-only view
            </div>
          ) : null}
          {footnote ? <div style={{ padding: '10px 20px', color: '#f0e2cf', fontSize: 13, marginTop: 'auto' }}>{footnote}</div> : null}
          <NavLink to="/account" style={{ display: 'block', padding: '10px 20px', color: '#d7dbe0', textDecoration: 'none', marginTop: footnote ? 0 : 'auto' }} data-testid="account-link">
            Account · sign out
          </NavLink>
        </nav>
        <main style={{ flex: '999 1 560px', minWidth: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}

export const colors = { ink: INK, leaf: LEAF, teak: TEAK, stem: STEM, vein: '#558b2f' };
