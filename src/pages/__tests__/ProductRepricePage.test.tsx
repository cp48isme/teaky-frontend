import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductRepricePage from '../ProductRepricePage';
import type { Portal } from '../../types/portal';
import type { CategoryMargin, Product, RepriceResult } from '../../types/product';

vi.mock('../../api/portals', () => ({
  getPortal: vi.fn(),
}));
vi.mock('../../api/products', () => ({
  listProducts: vi.fn(),
  listCategoryMargins: vi.fn(),
  repriceProducts: vi.fn(),
}));

import { getPortal } from '../../api/portals';
import { listCategoryMargins, listProducts, repriceProducts } from '../../api/products';

const PORTAL_ID = 'portal-1';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-1',
    portal_id: PORTAL_ID,
    sku: 'WY-TEE',
    name: 'Pig Tee',
    description: null,
    category: 'apparel',
    category_id: null,
    sizes: [],
    colors: [],
    pricing_tiers: [],
    mockup_urls: [],
    min_order_qty: 1,
    base_price: 28,
    base_cost: 15.6,
    margin_percent: '80.00',
    price_locked: false,
    proof_required: false,
    safe_order_eligible: false,
    dm_external_id: null,
    status: 'active',
    sort_order: 0,
    created_at: '2026-09-15T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
    ...overrides,
  };
}

const margins: CategoryMargin[] = [
  { category: 'apparel', default_margin_percent: '200.00', sample_size: 68 },
  { category: 'drinkware', default_margin_percent: '300.00', sample_size: 27 },
];

const dryRun: RepriceResult = {
  dry_run: true,
  margin_percent: '200',
  category: 'apparel',
  matched: 2,
  repriced: 1,
  skipped: 1,
  lines: [
    { product_id: 'p-1', sku: 'WY-TEE', name: 'Pig Tee', category: 'apparel', base_cost: 15.6, old_price: 28, new_price: 46.8, skipped: null },
    { product_id: 'p-2', sku: 'WY-CREW', name: 'Crewneck', category: 'apparel', base_cost: 19.17, old_price: 48, new_price: null, skipped: 'price_locked' },
  ],
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/portals/${PORTAL_ID}/products/reprice`]}>
      <Routes>
        <Route path="/portals/:portalId/products/reprice" element={<ProductRepricePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProductRepricePage', () => {
  beforeEach(() => {
    vi.mocked(getPortal).mockResolvedValue({ id: PORTAL_ID, name: 'Woodyard', slug: 'woodyard' } as Portal);
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct(),
      makeProduct({ id: 'p-2', name: 'Crewneck', category: 'apparel', price_locked: true }),
      makeProduct({ id: 'p-3', name: 'Mug', category: 'drinkware' }),
    ]);
    vi.mocked(listCategoryMargins).mockResolvedValue(margins);
    vi.mocked(repriceProducts).mockReset();
  });

  it('prefills the category default margin when a category is chosen', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Bulk reprice', { selector: 'h2' });

    await user.selectOptions(screen.getByRole('combobox'), 'apparel');
    expect(screen.getByLabelText('Margin over cost (%)')).toHaveValue(200);
  });

  it('previews as a dry run, shows skips, and only writes on apply', async () => {
    const user = userEvent.setup();
    vi.mocked(repriceProducts)
      .mockResolvedValueOnce(dryRun)
      .mockResolvedValueOnce({ ...dryRun, dry_run: false });
    renderPage();
    await screen.findByText('Bulk reprice', { selector: 'h2' });

    await user.selectOptions(screen.getByRole('combobox'), 'apparel');
    await user.click(screen.getByRole('button', { name: 'Preview changes' }));

    await screen.findByText(/Nothing has been written/);
    expect(repriceProducts).toHaveBeenCalledTimes(1);
    expect(vi.mocked(repriceProducts).mock.calls[0][1]).toMatchObject({
      margin_percent: '200.00',
      category: 'apparel',
      dry_run: true,
    });
    expect(screen.getByText('$46.80')).toBeInTheDocument();
    expect(screen.getByText('Price set by hand (locked)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Apply to 1 product(s)' }));
    await waitFor(() => expect(repriceProducts).toHaveBeenCalledTimes(2));
    expect(vi.mocked(repriceProducts).mock.calls[1][1]).toMatchObject({ dry_run: false, category: 'apparel' });
    await screen.findByText(/Repriced 1 of 2 product\(s\)/);
  });

  it('disables preview until a margin is entered', async () => {
    renderPage();
    await screen.findByText('Bulk reprice', { selector: 'h2' });
    expect(screen.getByRole('button', { name: 'Preview changes' })).toBeDisabled();
  });
});
