import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortalProductDetailPage from '../PortalProductDetailPage';

// S87: a product sold by option (key cards by locking system) — the buyer must
// pick one, sees each option's published price and the price-confirmed date,
// and the pick (never a price) is what is sent.

const addItem = vi.fn().mockResolvedValue(undefined);
const keyCards = {
  id: 'prod-kc',
  portal_id: 'portal-1',
  name: 'Key Cards',
  category: 'promotional',
  description: null,
  sku: null,
  category_id: null,
  sizes: [],
  colors: [],
  pricing_tiers: [],
  mockup_urls: [],
  min_order_qty: 1,
  pack_size: 1,
  pack_price: 0.3,
  base_price: null,
  option_set_name: 'Locking system',
  price_options: [
    { label: 'Magnetic', price: 0.3 },
    { label: 'RFID', price: 0.95 },
  ],
  proof_required: false,
  status: 'active',
  sort_order: 0,
};

vi.mock('../../../api/portals', () => ({ getPublicProduct: vi.fn(() => Promise.resolve(keyCards)) }));
vi.mock('../../../api/orders', () => ({ checkSafeOrder: vi.fn() }));
vi.mock('../../../api/quotes', () => ({ createPortalQuote: vi.fn() }));
vi.mock('../../../api/client', () => ({ isAuthenticated: () => true }));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael', slug: 'raphael', brand_config: null } }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/p/raphael/products/prod-kc']}>
      <Routes>
        <Route path="/p/:slug/products/:productId" element={<PortalProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PortalProductDetailPage — price options', () => {
  beforeEach(() => addItem.mockClear());

  it('requires a pick, shows its price and confirmed date, and sends the pick only', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Locking system')).toBeInTheDocument();
    const add = screen.getByRole('button', { name: 'Choose a locking system' });
    expect(add).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /RFID/ }));
    expect(screen.getByText('$0.95 each')).toBeInTheDocument();
    // 2026-10-08 (walkthrough N4): the pricing-review date is staff metadata and is not shown.
    expect(screen.queryByText(/Price confirmed/)).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({ product_id: 'prod-kc', price_option: 'RFID' }));
    expect(addItem.mock.calls[0][0]).not.toHaveProperty('unit_price');
  });
});
