import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductionLayout from '../../../components/production/ProductionLayout';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import { forgetSignedInDisplayName, rememberSignedInEmail } from '../../../lib/portalSession';
import type { ProductionShell } from '../../../types/organization';

/** The production layout carries the same account menu as the admin shell
 * (dispatch 19 Nov 2026): log out, account, settings — each routing where it
 * says; a read-only reader gets no Settings. */

const logout = vi.fn().mockResolvedValue(undefined);
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => ({ logout }), useOptionalAuth: () => ({ logout }) }));
vi.mock('../../../api/auth', () => ({ getMe: () => Promise.resolve({ id: 'u-1', email: 'staff@example.com', display_name: 'Shop Staff', organization_id: 'o', roles: ['printer_admin'] }), logout: vi.fn() }));
const shop: ProductionShell = { organization_id: 'org-1', name: 'Single Source US', mark: { url: 'https://app.example/production/single-source-logo.png', alt: 'Single Source US', source: 'shop_profile' } };
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: () => Promise.resolve(shop) }));

function mount(readOnly: boolean) {
  return render(
    <MemoryRouter initialEntries={['/production/batches']}>
      <Routes>
        <Route
          path="/production/batches"
          element={
            <ProductionLayout readOnly={readOnly}>
              <div>batches body</div>
            </ProductionLayout>
          }
        />
        <Route path="/account" element={<div>account page</div>} />
        <Route path="/settings/team" element={<div>settings page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetProductionShell();
  rememberSignedInEmail('staff@example.com');
  forgetSignedInDisplayName();
  logout.mockClear();
  mockNavigate.mockClear();
});

describe('the production layout account menu', () => {
  it('offers Account, Settings and Sign out to staff, and Account routes to /account', async () => {
    mount(false);
    await waitFor(() => expect(screen.getByTestId('shell-name')).toHaveTextContent('Single Source US'));
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByRole('menuitem', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Account' }));
    expect(await screen.findByText('account page')).toBeInTheDocument();
  });

  it('Settings routes to /settings/team', async () => {
    mount(false);
    await userEvent.click(screen.getByTestId('account-avatar'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(await screen.findByText('settings page')).toBeInTheDocument();
  });

  it('Sign out ends the session and goes to /login', async () => {
    mount(false);
    await userEvent.click(screen.getByTestId('account-avatar'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('a read-only reader gets Account and Sign out but no Settings; the sidebar account link stays', async () => {
    mount(true);
    expect(screen.getByTestId('account-link')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByRole('menuitem', { name: 'Account' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Settings' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
  });
});
