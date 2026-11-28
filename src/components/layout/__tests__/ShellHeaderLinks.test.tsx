import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppLayout from '../AppLayout';
import ProductionLayout from '../../production/ProductionLayout';
import { clearSession, setSession } from '../../../api/client';
import { resetCurrentUser } from '../../../lib/currentUser';

/** Navigation (28 Nov 2026, kkqk 1a): one header link each way between the
 * shop side and the floor, and a "?" in both headers that opens /help. The
 * floor link follows the same rule as the sidebar's Production item: a
 * floor role, and the server's has_floor once it has answered. */

vi.mock('../../../hooks/useMyOrganization', () => ({ useMyOrganization: () => ({ organization: { id: 'o', name: 'Shop', is_managed: true } }) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));
vi.mock('../../../hooks/useNotifications', () => ({ useNotifications: () => ({ unreadCount: 0, refresh: vi.fn(), notifications: [] }) }));
vi.mock('../../../hooks/useLoginLimiterStatus', () => ({ useLoginLimiterStatus: () => null }));
vi.mock('../../../hooks/useProductionShell', () => ({ useProductionShell: () => ({ name: 'Shot Shop', mark: { source: 'teaky', url: '', alt: 'Teaky' } }) }));
vi.mock('../../../api/auth', () => ({ getMe: vi.fn(), logout: vi.fn() }));
import { getMe } from '../../../api/auth';

function tokenWith(roles: string[], sub = 'user-1'): string {
  const b64 = (s: string) => btoa(s).replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ sub, roles }))}.sig`;
}
const me = (roles: string[], has_floor: boolean) => ({ id: 'user-1', email: 'x@example.com', display_name: null, organization_id: 'o', roles, home: has_floor ? '/production/batches' : '/dashboard', has_floor });

describe('the header links between the shells, and the "?"', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCurrentUser();
  });
  afterEach(() => clearSession());

  it('shop side: a printer_admin of a shop with a floor gets "Production floor →" and the "?"', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], true));
    render(<MemoryRouter><AppLayout><div>body</div></AppLayout></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    expect(await screen.findByTestId('to-floor-link')).toHaveAttribute('href', '/production/batches');
    const help = screen.getAllByTestId('help-link');
    expect(help).toHaveLength(1);
    expect(help[0]).toHaveAttribute('href', '/help');
    expect(help[0]).toHaveAccessibleName('Help');
  });

  it('shop side: an RGI-shaped shop (has_floor false) gets no floor link, still the "?"', async () => {
    setSession({ access_token: tokenWith(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['printer_admin'], false));
    render(<MemoryRouter><AppLayout><div>body</div></AppLayout></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByTestId('to-floor-link')).toBeNull());
    expect(screen.getByTestId('help-link')).toHaveAttribute('href', '/help');
  });

  it('shop side: a sales_rep (no floor grant) gets no floor link', async () => {
    setSession({ access_token: tokenWith(['sales_rep']), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMe).mockResolvedValue(me(['sales_rep'], true));
    render(<MemoryRouter><AppLayout><div>body</div></AppLayout></MemoryRouter>);
    await waitFor(() => expect(getMe).toHaveBeenCalled());
    expect(screen.queryByTestId('to-floor-link')).toBeNull();
  });

  it('the floor: "← Shop admin" in the header and the "?"; a read-only reader gets the "?" alone', () => {
    const { unmount } = render(<MemoryRouter><ProductionLayout readOnly={false}><div>body</div></ProductionLayout></MemoryRouter>);
    expect(screen.getByTestId('to-admin-link')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('help-link')).toHaveAttribute('href', '/help');
    unmount();
    render(<MemoryRouter><ProductionLayout readOnly><div>body</div></ProductionLayout></MemoryRouter>);
    expect(screen.queryByTestId('to-admin-link')).toBeNull();
    expect(screen.getByTestId('help-link')).toHaveAttribute('href', '/help');
  });
});
