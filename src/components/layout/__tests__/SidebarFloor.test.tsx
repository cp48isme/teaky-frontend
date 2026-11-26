import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '../Sidebar';
import { clearSession, setSession } from '../../../api/client';
import { resetCurrentUser } from '../../../lib/currentUser';

// Ruling 26 Nov 2026 item 4: the server decides. Production is offered only
// when the role has a floor grant AND the server's has_floor says the shop has
// a floor to show; an RGI-shaped shop (no press-run config, no units) hides it
// even from its printer_admin. Before the answer, the role list alone decides.

vi.mock('../../../hooks/useMyOrganization', () => ({ useMyOrganization: () => ({ organization: { id: 'o', name: 'Shop', is_managed: true } }) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));
vi.mock('../../../api/auth', () => ({ getMe: vi.fn() }));
import { getMe } from '../../../api/auth';

function tokenWith(roles: string[], sub = 'user-1'): string {
  const b64 = (s: string) => btoa(s).replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ sub, roles }))}.sig`;
}

const me = (roles: string[], has_floor: boolean) => ({ id: 'user-1', email: 'x@example.com', display_name: null, organization_id: 'o', roles, home: has_floor ? '/production/batches' : '/dashboard', has_floor });

describe('Sidebar: Production follows the server has_floor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCurrentUser();
  });
  afterEach(() => clearSession());

  it('hides Production from an RGI-shaped printer_admin (has_floor false)', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], false));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByRole('link', { name: 'Production' })).toBeNull());
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('shows Production, after Dashboard, to a printer_admin of a shop with a floor (has_floor true)', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], true));
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    const links = screen.getAllByRole('link').map((l) => l.textContent);
    expect(links[0]).toBe('Dashboard');
    expect(links[1]).toBe('Production');
  });

  it('never shows Production to a sales_rep, sales_team_lead or store_creator, floor or none', async () => {
    for (const role of ['sales_rep', 'sales_team_lead', 'store_creator']) {
      resetCurrentUser();
      setSession({ access_token: tokenWith([role], `u-${role}`), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me([role], true));
      const { unmount } = render(<MemoryRouter><Sidebar /></MemoryRouter>);
      await waitFor(() => expect(getMe).toHaveBeenCalled());
      expect(screen.queryByRole('link', { name: 'Production' }), role).toBeNull();
      unmount();
      vi.clearAllMocks();
    }
  });

  it('on an older server (no has_floor) the role list decides alone', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue({ id: 'user-1', email: 'x@example.com', display_name: null, organization_id: 'o', roles: ['printer_admin'] });
    render(<MemoryRouter><Sidebar /></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    expect(screen.getByRole('link', { name: 'Production' })).toHaveAttribute('href', '/production/batches');
  });
});
