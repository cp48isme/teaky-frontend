import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductionLayout from '../../../components/production/ProductionLayout';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import type { ProductionShell } from '../../../types/organization';

/** The shell's mark and name are the signed-in organisation's (ruling 18 Nov
 * 2026): the shop's own mark with "Powered by Teaky", or Teaky's own mark
 * alone when the shop has none; nothing while loading or when refused. */

let answer: () => Promise<ProductionShell>;
const getProductionShell = vi.fn(() => answer());
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: () => getProductionShell() }));

const sandbox: ProductionShell = { organization_id: 'org-s', name: 'Teaky Sandbox (not a customer)', mark: { url: 'https://app.example/email/teaky-logo.png', alt: 'Teaky', source: 'teaky' } };
const shop: ProductionShell = { organization_id: 'org-1', name: 'Single Source US', mark: { url: 'https://app.example/production/single-source-logo.png', alt: 'Single Source US', source: 'shop_profile' } };

function mount() {
  return render(
    <MemoryRouter>
      <ProductionLayout readOnly={false}>
        <div>body</div>
      </ProductionLayout>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetProductionShell();
  getProductionShell.mockClear();
});

describe('the production shell', () => {
  it("a shop without a mark of its own: Teaky's mark alone, the shop's name, no Powered by", async () => {
    answer = () => Promise.resolve(sandbox);
    mount();
    await waitFor(() => expect(screen.getByTestId('shell-name')).toHaveTextContent('Teaky Sandbox (not a customer)'));
    const mark = screen.getByTestId('shell-mark');
    expect(mark).toHaveAttribute('alt', 'Teaky');
    expect(mark).toHaveAttribute('data-source', 'teaky');
    expect(mark.getAttribute('src')).toBe('/production/teaky-wordmark-white.png');
    expect(screen.queryByTestId('powered-by')).toBeNull();
    expect(screen.queryByText(/Single Source/)).toBeNull();
    expect(getProductionShell).toHaveBeenCalledTimes(1);
  });

  it('a shop with its own mark: that mark named after it, Powered by Teaky beside it, its name in the sidebar', async () => {
    answer = () => Promise.resolve(shop);
    mount();
    await waitFor(() => expect(screen.getByTestId('shell-name')).toHaveTextContent('Single Source US'));
    const mark = screen.getByTestId('shell-mark');
    expect(mark).toHaveAttribute('alt', 'Single Source US');
    expect(mark).toHaveAttribute('data-source', 'shop_profile');
    expect(mark.getAttribute('src')).toBe(shop.mark.url);
    expect(screen.getByTestId('powered-by')).toHaveTextContent('Powered by');
  });

  it('while loading, and when the read is refused: no mark and no name, never a wrong one', async () => {
    let settle: (s: ProductionShell) => void = () => undefined;
    answer = () =>
      new Promise((resolve) => {
        settle = resolve;
      });
    mount();
    expect(screen.getByTestId('shell-loading')).toBeTruthy();
    expect(screen.queryByTestId('shell-mark')).toBeNull();
    expect(screen.getByTestId('shell-name')).toHaveTextContent('');
    settle(sandbox);
    await waitFor(() => expect(screen.getByTestId('shell-mark')).toBeTruthy());

    resetProductionShell();
    answer = () => Promise.reject(new Error('403'));
    const refused = mount();
    await waitFor(() => expect(getProductionShell).toHaveBeenCalledTimes(2));
    await new Promise((r) => setTimeout(r, 0));
    expect(refused.container.querySelectorAll('[data-testid="shell-mark"]').length).toBe(0);
    expect(refused.container.querySelector('[data-testid="shell-name"]')).toHaveTextContent('');
  });
});
