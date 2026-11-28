import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '../Sidebar';
import { clearSession, setSession } from '../../../api/client';
import { resetCurrentUser } from '../../../lib/currentUser';

/** Navigation 1b (dispatch 28 Nov 2026 afternoon; ruling 26 Nov 2026 point
 * 2): a print-shop role sees only the sections that do something for a shop
 * today. Quotes, Analytics, Agents and Messages are the platform operator's
 * and leave the menu for everyone else; their routes stay. */

vi.mock('../../../hooks/useMyOrganization', () => ({ useMyOrganization: () => ({ organization: { id: 'o', name: 'Shop', is_managed: true } }) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));
vi.mock('../../../api/auth', () => ({ getMe: vi.fn() }));
import { getMe } from '../../../api/auth';

function tokenWith(roles: string[], sub = 'user-1'): string {
  const b64 = (s: string) => btoa(s).replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ sub, roles }))}.sig`;
}
const me = (roles: string[], has_floor: boolean) => ({ id: 'user-1', email: 'x@example.com', display_name: null, organization_id: 'o', roles, home: has_floor ? '/production/batches' : '/dashboard', has_floor });
const labels = () => screen.getAllByRole('link').map((a) => a.textContent?.trim());

describe('Sidebar: live sections only for a print shop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCurrentUser();
  });
  afterEach(() => clearSession());

  it('a printer_admin of a shop with a floor: Dashboard, Production, Portals, Orders, Settings — nothing else', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], true));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(labels()).toEqual(['Dashboard', 'Production', 'Portals', 'Orders', 'Settings']));
  });

  for (const role of ['sales_rep', 'sales_team_lead', 'store_creator', 'billing_contact']) {
    it(`${role}: Dashboard, Portals, Orders, Settings`, async () => {
      setSession({ access_token: tokenWith([role]), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me([role], true));
      render(<MemoryRouter><Sidebar /></MemoryRouter>);
      await waitFor(() => expect(getMe).toHaveBeenCalled());
      await waitFor(() => expect(labels()).toEqual(['Dashboard', 'Portals', 'Orders', 'Settings']));
    });
  }

  it('the platform operator (super_admin) still sees Quotes, Analytics, Agents and Messages', async () => {
    setSession({ access_token: tokenWith(['super_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['super_admin'], true));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(labels()).toEqual(['Dashboard', 'Production', 'Portals', 'Orders', 'Quotes', 'Analytics', 'Agents', 'Messages', 'Settings']));
  });
});
