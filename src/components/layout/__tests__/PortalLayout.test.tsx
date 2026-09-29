import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortalLayout from '../PortalLayout';

// Buyer-journey items 9 and 10 (2026-09-25): the portal header offers Sign in
// with a return path, shows who is signed in with a Sign out, and renders the
// cart count inline (not clipped above the header).

let authed = false;
const logout = vi.fn().mockResolvedValue(undefined);
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../../api/client', () => ({ isAuthenticated: () => authed }));
vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => ({ logout }) }));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael Hotel', slug: 'raphael', brand_config: null }, loading: false, error: null }),
}));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ itemCount: 1500 }) }));
vi.mock('../../../lib/portalSession', () => ({
  rememberPortal: vi.fn(),
  signedInEmail: () => 'frontdesk@example.com',
  forgetSignedInEmail: vi.fn(),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/p/raphael']}>
      <Routes>
        <Route path="/p/:slug" element={<PortalLayout />}>
          <Route index element={<div>home</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('PortalLayout header', () => {
  beforeEach(() => vi.clearAllMocks());

  it('offers Sign in that returns to this portal when signed out', () => {
    authed = false;
    renderLayout();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=/p/raphael');
    expect(screen.queryByText('My Orders')).not.toBeInTheDocument();
  });

  it('shows who is signed in, the inline cart count, and signs out back to the portal', async () => {
    authed = true;
    const user = userEvent.setup();
    renderLayout();
    expect(screen.getByText('frontdesk@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('1500 items in cart')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael');
  });
});
