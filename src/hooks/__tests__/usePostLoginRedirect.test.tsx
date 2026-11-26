import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePostLoginRedirect } from '../usePostLoginRedirect';

// Buyer-journey item 1 (2026-09-25): a buyer signing in lands on their portal,
// never on the printer onboarding wizard, and the company-profile lookup that
// used to 404 for them is not made.

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../api/companyProfiles', () => ({ getCompanyProfileByOrg: vi.fn() }));
vi.mock('../../api/organizations', () => ({ getMyOrganization: vi.fn() }));
vi.mock('../../api/portals', () => ({ listPortals: vi.fn() }));
vi.mock('../../api/auth', () => ({ listMyPortals: vi.fn(), getMe: vi.fn() }));
import { getCompanyProfileByOrg } from '../../api/companyProfiles';
import { getMyOrganization } from '../../api/organizations';
import { listPortals } from '../../api/portals';
import { getMe, listMyPortals } from '../../api/auth';
import { CHOOSE_PORTAL_PATH } from '../usePostLoginRedirect';
import { clearSession, setSession } from '../../api/client';

function fakeJwt(claims: Record<string, unknown>): string {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64(claims)}.sig`;
}

// An in-memory Storage so the test is hermetic regardless of jsdom's origin rules.
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (k: string) => data.get(k) ?? null,
    key: (i: number) => Array.from(data.keys())[i] ?? null,
    removeItem: (k: string) => { data.delete(k); },
    setItem: (k: string, v: string) => { data.set(k, String(v)); },
  } as Storage;
}

describe('usePostLoginRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', memoryStorage());
    clearSession(); // the access token lives in memory now (cookie cut-over)
    vi.mocked(getMyOrganization).mockResolvedValue({ id: 'org-print', name: 'Print', is_managed: false });
    vi.mocked(listPortals).mockResolvedValue([]);
    // belq (30 Oct 2026): the buyer's own portals come from the server.
    vi.mocked(listMyPortals).mockResolvedValue([{ id: 'p-raphael', name: 'The Raphael', slug: 'raphael', status: 'active' }]);
    // An older server (no `home` on /auth/me): the cases below run on the local rule.
    vi.mocked(getMe).mockRejectedValue(new Error('older server'));
  });

  // Ruling 26 Nov 2026 item 4: the server decides the landing. GET /auth/me's
  // `home` is computed from the access matrix and the shop's facts; the client
  // sends nobody anywhere the matrix will 403.
  describe("the server's answer (GET /auth/me home)", () => {
    const me = (home: string, has_floor: boolean, roles = ['printer_admin']) => ({ id: 'u', email: 'x@example.com', display_name: null, organization_id: 'org', roles, home, has_floor });

    it('a printer_admin of a shop with a floor (Single Source) lands on the floor — one-navigation ruling point (1)', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-ss', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me('/production/batches', true));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/production/batches');
      expect(getMyOrganization).not.toHaveBeenCalled();
      expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
    });

    it('an RGI-shaped admin (no config, no units: has_floor false) lands on /dashboard', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me('/dashboard', false));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('a sales_rep is sent where the server says (/dashboard), never the floor the matrix refuses', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-ss', roles: ['sales_rep'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me('/dashboard', true, ['sales_rep']));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockNavigate).not.toHaveBeenCalledWith('/production/batches');
    });

    it('a buyer lands on the portal the server names', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me('/p/raphael', false, ['end_user']));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
      expect(listMyPortals).not.toHaveBeenCalled();
    });

    it("the chooser from the server still yields to a remembered portal that is theirs (the browser's fact)", async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      localStorage.setItem('teaky_last_portal', 'allegretto');
      vi.mocked(getMe).mockResolvedValue(me(CHOOSE_PORTAL_PATH, false, ['end_user']));
      vi.mocked(listMyPortals).mockResolvedValueOnce([
        { id: 'p1', name: 'The Raphael', slug: 'raphael', status: 'active' },
        { id: 'p2', name: 'Allegretto', slug: 'allegretto', status: 'active' },
      ]);
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/p/allegretto');
    });

    it('an explicit same-origin next path still wins over the server', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-ss', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(getMe).mockResolvedValue(me('/production/batches', true));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current('/orders/42');
      expect(mockNavigate).toHaveBeenCalledWith('/orders/42');
      expect(getMe).not.toHaveBeenCalled();
    });
  });

  it('sends a buyer back to the portal they were on and never asks for a company profile', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('sends a buyer who also holds printer_admin (the registration-form artefact) to their portal', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user', 'printer_admin'] }), token_type: 'bearer', expires_in: 900 });
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('prefers an explicit same-origin next path for a buyer', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current('/p/allegretto/cart');
    expect(mockNavigate).toHaveBeenCalledWith('/p/allegretto/cart');
  });

  it('ignores an off-site next path', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current('https://evil.example/phish');
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
  });

  it('keeps the wizard rule for a printer user without a complete profile', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-print', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getCompanyProfileByOrg).mockRejectedValueOnce(new Error('404'));
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(getCompanyProfileByOrg).toHaveBeenCalledWith('org-print');
    expect(mockNavigate).toHaveBeenCalledWith('/get-started');
  });

  it('never sends a managed account to the wizard, profile or not (8 Oct 2026 ruling)', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getMyOrganization).mockResolvedValueOnce({ id: 'org-rgi', name: 'RGI Publications', is_managed: true });
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('never sends an organisation that already has a portal to the wizard', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-print', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
    vi.mocked(listPortals).mockResolvedValueOnce([{ id: 'p1' } as never]);
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('sends a printer user with a complete profile to the dashboard', async () => {
    setSession({ access_token: fakeJwt({ org: 'org-print', roles: ['printer_admin'] }), token_type: 'bearer', expires_in: 900 });
    vi.mocked(getCompanyProfileByOrg).mockResolvedValueOnce({ is_wizard_complete: true } as never);
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // belq (ruling 30 Oct 2026): one portal → that portal; several → a chooser;
  // never the public landing page.
  describe('a buyer with no remembered portal (a fresh browser)', () => {
    it('goes to the one portal they belong to', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
      expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });

    it('a portal_admin with one portal goes there too', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['portal_admin'] }), token_type: 'bearer', expires_in: 900 });
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
    });

    it('is offered a chooser when they belong to several', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(listMyPortals).mockResolvedValueOnce([
        { id: 'p1', name: 'The Raphael', slug: 'raphael', status: 'active' },
        { id: 'p2', name: 'Allegretto', slug: 'allegretto', status: 'active' },
      ]);
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith(CHOOSE_PORTAL_PATH);
    });

    it('goes to the remembered portal when it is one of several', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      localStorage.setItem('teaky_last_portal', 'allegretto');
      vi.mocked(listMyPortals).mockResolvedValueOnce([
        { id: 'p1', name: 'The Raphael', slug: 'raphael', status: 'active' },
        { id: 'p2', name: 'Allegretto', slug: 'allegretto', status: 'active' },
      ]);
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith('/p/allegretto');
    });

    it('is sent to the chooser, which says so, when they belong to none — never to the landing page', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(listMyPortals).mockResolvedValueOnce([]);
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith(CHOOSE_PORTAL_PATH);
      expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });

    it('falls back to the remembered portal, else the chooser, when the server does not know the route yet', async () => {
      setSession({ access_token: fakeJwt({ org: 'org-rgi', roles: ['end_user'] }), token_type: 'bearer', expires_in: 900 });
      vi.mocked(listMyPortals).mockRejectedValueOnce(new Error('404'));
      const { result } = renderHook(() => usePostLoginRedirect());
      await result.current();
      expect(mockNavigate).toHaveBeenCalledWith(CHOOSE_PORTAL_PATH);
      localStorage.setItem('teaky_last_portal', 'raphael');
      vi.mocked(listMyPortals).mockRejectedValueOnce(new Error('404'));
      await result.current();
      expect(mockNavigate).toHaveBeenLastCalledWith('/p/raphael');
    });
  });
});
