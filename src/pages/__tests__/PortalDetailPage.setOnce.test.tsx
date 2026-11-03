import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PortalDetailPage from '../PortalDetailPage';
import { PreviewProvider } from '../../context/PreviewContext';

// Cause 8 (30 Oct 2026): classification and revenue share are set once and
// cannot be changed in place, so the form restates the exact values and asks
// again before committing them. A mistyped share rate on a real customer was
// permanent on the first click.

const portal = {
  id: 'portal-1',
  organization_id: 'org-1',
  name: 'The Raphael',
  slug: 'raphael',
  type: 'client',
  status: 'active',
  lifecycle_status: 'active',
  created_via: 'manual',
  approval_workflow: 'none',
  brand_config: null,
  customer_classification: null,
  revenue_share_rate: null,
  self_registration: false,
  require_po: false,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
};
const updatePortal = vi.fn();
vi.mock('../../api/portals', () => ({
  getPortal: vi.fn(() => Promise.resolve(portal)),
  listPortalInvitations: vi.fn(() => Promise.resolve([])),
  publishPortal: vi.fn(),
  invitePortalUser: vi.fn(),
  duplicatePortal: vi.fn(),
  updatePortal: (...args: unknown[]) => updatePortal(...args),
}));

function renderPage() {
  return render(
    <PreviewProvider>
      <MemoryRouter initialEntries={['/portals/portal-1']}>
        <Routes>
          <Route path="/portals/:portalId" element={<PortalDetailPage />} />
        </Routes>
      </MemoryRouter>
    </PreviewProvider>,
  );
}

describe('PortalDetailPage — set once, with a confirmation that restates the values', () => {
  beforeEach(() => {
    updatePortal.mockReset();
    updatePortal.mockImplementation((_id: string, data: Record<string, unknown>) =>
      Promise.resolve({ ...portal, ...data }),
    );
  });

  it('restates the classification and the rate, commits only on confirm, and lets the user go back', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.selectOptions(await screen.findByLabelText('Classification'), 'existing');
    await user.type(screen.getByLabelText('Share rate (%)'), '12');
    await user.click(screen.getByRole('button', { name: 'Set once' }));
    const panel = screen.getByRole('group', { name: /Set once, for The Raphael/ });
    expect(panel).toHaveTextContent('Existing (RGI account before Teaky)');
    expect(panel).toHaveTextContent('12%');
    expect(updatePortal).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Go back' }));
    expect(screen.queryByRole('group', { name: /Set once/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Share rate (%)')).toHaveValue('12');

    await user.click(screen.getByRole('button', { name: 'Set once' }));
    await user.click(screen.getByRole('button', { name: 'Confirm — set once' }));
    await waitFor(() => expect(updatePortal).toHaveBeenCalledTimes(1));
    expect(updatePortal).toHaveBeenCalledWith('portal-1', { customer_classification: 'existing', revenue_share_rate: 0.12 });
    await waitFor(() => expect(screen.getByText('12%')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'Set once' })).not.toBeInTheDocument();
  });

  it('refuses a rate that is not a percentage before asking for confirmation', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(await screen.findByLabelText('Share rate (%)'), '120');
    await user.click(screen.getByRole('button', { name: 'Set once' }));
    expect(screen.getByText('The share rate is a percentage from 0 to 100.')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /Set once/ })).not.toBeInTheDocument();
    expect(updatePortal).not.toHaveBeenCalled();
  });
});
