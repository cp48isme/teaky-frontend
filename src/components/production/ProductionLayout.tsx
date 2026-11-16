import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { isShadowReader } from '../../lib/roles';

/** The production side's shell (canvas boards 1–5, 5–6 Nov 2026): the
 * co-branded header (Single Source, powered by Teaky) and the teak sidebar
 * with the production vocabulary — orders, batches, held, products, floor. */

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
];

/** The read-only shell (dispatch 16 Nov 2026, item 5): a shadow_reader sees
 * All Channel Orders, Batches and Held — what the three routes it may read
 * return — and no action anywhere. */
const READ_ONLY_NAV = new Set(['/production/orders', '/production/batches', '/production/held']);

export default function ProductionLayout({ children, footnote, readOnly = isShadowReader() }: { children: ReactNode; footnote?: string; readOnly?: boolean }) {
  const nav = readOnly ? NAV.filter((item) => READ_ONLY_NAV.has(item.to)) : NAV;
  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f7', color: INK, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <header
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: '10px 24px', background: INK, borderBottom: `3px solid ${LEAF}` }}
      >
        <img src="/production/single-source-logo.png" alt="Single Source Printing" style={{ height: 44, width: 'auto', display: 'block' }} />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#cfc9c2' }}>
          Powered by <img src="/production/teaky-wordmark-white.png" alt="Teaky" style={{ height: 30, width: 'auto', display: 'block' }} />
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 'calc(100vh - 67px)' }}>
        <nav
          aria-label="Production"
          style={{ flex: '0 0 200px', background: TEAK, color: '#f6ede0', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <div style={{ padding: '0 20px 20px', fontWeight: 600, color: '#fff', fontSize: 15 }}>Single Source US</div>
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
        </nav>
        <main style={{ flex: '999 1 560px', minWidth: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</main>
      </div>
    </div>
  );
}

export const colors = { ink: INK, leaf: LEAF, teak: TEAK, stem: STEM, vein: '#558b2f' };
