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
import { getCompanyProfileByOrg } from '../../api/companyProfiles';

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
  });

  it('sends a buyer back to the portal they were on and never asks for a company profile', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-rgi', roles: ['end_user'] }));
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('sends a buyer who also holds printer_admin (the registration-form artefact) to their portal', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-rgi', roles: ['end_user', 'printer_admin'] }));
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
    expect(getCompanyProfileByOrg).not.toHaveBeenCalled();
  });

  it('prefers an explicit same-origin next path for a buyer', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-rgi', roles: ['end_user'] }));
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current('/p/allegretto/cart');
    expect(mockNavigate).toHaveBeenCalledWith('/p/allegretto/cart');
  });

  it('ignores an off-site next path', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-rgi', roles: ['end_user'] }));
    localStorage.setItem('teaky_last_portal', 'raphael');
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current('https://evil.example/phish');
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
  });

  it('keeps the wizard rule for a printer user without a complete profile', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-print', roles: ['printer_admin'] }));
    vi.mocked(getCompanyProfileByOrg).mockRejectedValueOnce(new Error('404'));
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(getCompanyProfileByOrg).toHaveBeenCalledWith('org-print');
    expect(mockNavigate).toHaveBeenCalledWith('/get-started');
  });

  it('sends a printer user with a complete profile to the dashboard', async () => {
    localStorage.setItem('access_token', fakeJwt({ org: 'org-print', roles: ['printer_admin'] }));
    vi.mocked(getCompanyProfileByOrg).mockResolvedValueOnce({ is_wizard_complete: true } as never);
    const { result } = renderHook(() => usePostLoginRedirect());
    await result.current();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
