import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '../Sidebar';
import ProductionLayout from '../../production/ProductionLayout';
import SettingsLayout from '../../../pages/settings/SettingsLayout';
import FloorSettingsPage from '../../../pages/settings/FloorSettingsPage';
import { clearSession, setSession } from '../../../api/client';
import { resetCurrentUser } from '../../../lib/currentUser';

/** Navigation 1c (dispatch 28 Nov 2026 afternoon; ruling 26 Nov 2026 point
 * 3): no two sections share a name across the shells. The admin menu's
 * Orders is All Channel Orders for a shop with a floor (the floor's page,
 * with the Lane column); a shop without a floor keeps Orders. Settings is
 * one hub: the floor nav has no Settings, and the production settings are
 * the hub's Floor tab. */

vi.mock('../../../hooks/useMyOrganization', () => ({ useMyOrganization: () => ({ organization: { id: 'o', name: 'Shop', is_managed: true } }) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));
vi.mock('../../../hooks/useProductionShell', () => ({ useProductionShell: () => ({ name: 'Shot Shop', mark: { source: 'teaky', url: '', alt: 'Teaky' } }) }));
vi.mock('../../../api/auth', () => ({ getMe: vi.fn(), logout: vi.fn() }));
vi.mock('../../../api/production', () => ({
  getProductionSettings: vi.fn(() => Promise.resolve({ split_when_unplaceable: true, gang_whole_orders: true, hold_age_days: 2, shop_name: 'Shop', timezone: 'America/Chicago', production_view: 'cards' })),
  updateProductionSettings: vi.fn(),
  getTagRules: vi.fn(() => Promise.resolve({ customer_tags: [] })),
  updateTagRules: vi.fn(),
}));
import { getMe } from '../../../api/auth';

function tokenWith(roles: string[], sub = 'user-1'): string {
  const b64 = (s: string) => btoa(s).replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ sub, roles }))}.sig`;
}
const me = (roles: string[], has_floor: boolean) => ({ id: 'user-1', email: 'x@example.com', display_name: null, organization_id: 'o', roles, home: has_floor ? '/production/batches' : '/dashboard', has_floor });
const links = () => screen.getAllByRole('link').map((a) => [a.textContent?.trim(), a.getAttribute('href')]);

describe('one name, one thing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCurrentUser();
  });
  afterEach(() => clearSession());

  it('a shop with a floor: the admin menu says All Channel Orders and points at the floor page', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], true));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(links()).toContainEqual(['All Channel Orders', '/production/orders']));
    expect(screen.queryByRole('link', { name: 'Orders' })).toBeNull();
  });

  it('a shop without a floor (RGI): the admin menu keeps Orders → /orders', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], false));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Production' })).toBeNull());
    expect(links()).toContainEqual(['Orders', '/orders']);
    expect(screen.queryByRole('link', { name: 'All Channel Orders' })).toBeNull();
  });

  it('the floor nav has no Settings; the avatar menu is the one way to Settings', () => {
    render(<MemoryRouter><ProductionLayout readOnly={false}><div /></ProductionLayout></MemoryRouter>);
    const nav = screen.getByRole('navigation', { name: 'Production' });
    const labels = Array.from(nav.querySelectorAll('a')).map((a) => a.textContent?.trim());
    expect(labels).not.toContain('Settings');
    expect(labels).toEqual(['← Dashboard', 'All Channel Orders', 'Batches', 'Held', 'Stocked goods', 'Products', 'Floor', 'Account · sign out']);
  });

  it('the hub has one Admin tab and a Floor tab for a printer_admin, and /settings/floor renders the production settings', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    render(
      <MemoryRouter initialEntries={['/settings/floor']}>
        <Routes>
          <Route path="/settings" element={<SettingsLayout />}>
            <Route path="floor" element={<FloorSettingsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    const tabs = screen.getAllByRole('link').map((a) => a.textContent?.trim());
    expect(tabs.filter((t) => t === 'Admin')).toHaveLength(1);
    expect(tabs).toContain('Floor');
    expect(await screen.findByTestId('view-default')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Production settings' })).toBeInTheDocument();
  });
});
