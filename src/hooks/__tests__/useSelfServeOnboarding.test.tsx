import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetMyOrganization } from '../useMyOrganization';
import { resetSelfServeOnboarding, useSelfServeOnboarding } from '../useSelfServeOnboarding';

// Cause 5 (30 Oct 2026): the wizard is for a self-serve signup with nothing
// yet — not managed, no portal. Unknown counts as not self-serve.

vi.mock('../../api/organizations', () => ({ getMyOrganization: vi.fn() }));
vi.mock('../../api/portals', () => ({ listPortals: vi.fn() }));
import { getMyOrganization } from '../../api/organizations';
import { listPortals } from '../../api/portals';

describe('useSelfServeOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMyOrganization();
    resetSelfServeOnboarding();
  });

  it('is true only for an unmanaged organisation with no portal', async () => {
    vi.mocked(getMyOrganization).mockResolvedValue({ id: 'o', name: 'New Shop', is_managed: false });
    vi.mocked(listPortals).mockResolvedValue([]);
    const { result } = renderHook(() => useSelfServeOnboarding());
    expect(result.current.selfServe).toBeNull();
    await waitFor(() => expect(result.current.selfServe).toBe(true));
  });

  it('is false for a managed organisation', async () => {
    vi.mocked(getMyOrganization).mockResolvedValue({ id: 'o', name: 'RGI', is_managed: true });
    vi.mocked(listPortals).mockResolvedValue([]);
    const { result } = renderHook(() => useSelfServeOnboarding());
    await waitFor(() => expect(result.current.selfServe).toBe(false));
  });

  it('is false for an organisation that already has a portal, whatever its flag says', async () => {
    vi.mocked(getMyOrganization).mockResolvedValue({ id: 'o', name: 'Teaky Sandbox (not a customer)', is_managed: false });
    vi.mocked(listPortals).mockResolvedValue([{ id: 'p1' } as never]);
    const { result } = renderHook(() => useSelfServeOnboarding());
    await waitFor(() => expect(result.current.selfServe).toBe(false));
  });

  it('is false when the portal list cannot be read', async () => {
    vi.mocked(getMyOrganization).mockResolvedValue({ id: 'o', name: 'Shop', is_managed: false });
    vi.mocked(listPortals).mockRejectedValue(new Error('403'));
    const { result } = renderHook(() => useSelfServeOnboarding());
    await waitFor(() => expect(result.current.selfServe).toBe(false));
  });
});
