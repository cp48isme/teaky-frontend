import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductionLayout from '../../../components/production/ProductionLayout';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import { readThemePreference, themeAttribute, writeThemePreference } from '../../../lib/theme';

/** Dark mode for the production floor (ruling 20 Nov 2026, rev 47): the
 * floor's root carries no theme attribute by default, so the system setting
 * decides through the media query; a per-user choice (Light / Dark, in the
 * account menu on the floor) sets the attribute and is remembered in this
 * browser for that user; System clears it. The admin shell is untouched. */

vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => ({ logout: vi.fn() }), useOptionalAuth: () => ({ logout: vi.fn(), ready: true, authenticated: true }) }));
vi.mock('../../../api/auth', () => ({ getMe: () => Promise.resolve({ id: 'u-1', email: 'staff@example.com', display_name: 'Shop Staff', organization_id: 'o', roles: ['printer_admin'] }), logout: () => Promise.resolve() }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: () => Promise.resolve({ organization_id: 'o', name: 'Single Source US', mark: { url: 'https://app.example/logo.png', alt: 'Single Source US', source: 'shop_profile' } }) }));
vi.mock('../../../lib/roles', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../../lib/roles')>()), currentUserId: () => 'u-1', isShadowReader: () => false }));

beforeEach(() => {
  localStorage.clear();
  resetProductionShell();
});

describe('the floor theme', () => {
  it('follows the system by default: no attribute on the root; a choice is per user and remembered', () => {
    expect(readThemePreference()).toBe('system');
    expect(themeAttribute('system')).toBeUndefined();
    writeThemePreference('dark');
    expect(readThemePreference()).toBe('dark');
    expect(localStorage.getItem('teaky.floor.theme.u-1')).toBe('dark');
    writeThemePreference('system');
    expect(localStorage.getItem('teaky.floor.theme.u-1')).toBeNull();
  });

  it('the account menu on the floor offers System / Light / Dark and the root follows the choice', async () => {
    render(
      <MemoryRouter>
        <ProductionLayout readOnly={false}>
          <div>body</div>
        </ProductionLayout>
      </MemoryRouter>,
    );
    const root = await screen.findByTestId('production-root');
    expect(root).not.toHaveAttribute('data-theme');
    expect(root).toHaveClass('production-root');
    await userEvent.click(screen.getByTestId('account-avatar'));
    const control = screen.getByTestId('theme-control');
    expect(control).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('theme-dark'));
    await waitFor(() => expect(root).toHaveAttribute('data-theme', 'dark'));
    expect(screen.getByTestId('theme-dark')).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByTestId('theme-light'));
    await waitFor(() => expect(root).toHaveAttribute('data-theme', 'light'));
    await userEvent.click(screen.getByTestId('theme-system'));
    await waitFor(() => expect(root).not.toHaveAttribute('data-theme'));
  });
});
