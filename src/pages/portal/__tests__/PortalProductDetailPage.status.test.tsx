import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortalProductDetailPage from '../PortalProductDetailPage';
import StatusProvider from '../../../contexts/StatusProvider';
import { ApiError } from '../../../api/client';

// 30 Oct 2026 (ruling R1): the three silent shapes the 29 Oct pass found on
// this page — a cap refusal swallowed, a disabled button with no reason, and
// a success that flashed and said nothing — all now reach the status region.

const addItem = vi.fn();
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
  option_set_name: null,
  price_options: [],
  proof_required: false,
  status: 'active',
  sort_order: 0,
  max_order_quantity: 4,
};
const businessCards = {
  ...keyCards,
  id: 'prod-bc',
  name: 'Business Cards (per person)',
  pack_size: 100,
  pack_price: 75,
  collects_recipients: true,
};
let currentProduct: Record<string, unknown> = keyCards;
vi.mock('../../../api/portals', () => ({ getPublicProduct: vi.fn(() => Promise.resolve(currentProduct)) }));
vi.mock('../../../api/orders', () => ({ checkSafeOrder: vi.fn() }));
vi.mock('../../../api/quotes', () => ({ createPortalQuote: vi.fn() }));
vi.mock('../../../api/client', async () => ({
  ...(await vi.importActual<typeof import('../../../api/client')>('../../../api/client')),
  isAuthenticated: () => true,
}));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael', slug: 'raphael', brand_config: null } }),
}));

function renderPage() {
  return render(
    <StatusProvider>
      <MemoryRouter initialEntries={['/p/raphael/products/prod-kc']}>
        <Routes>
          <Route path="/p/:slug/products/:productId" element={<PortalProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </StatusProvider>,
  );
}

describe('PortalProductDetailPage — outcomes reach the status region', () => {
  beforeEach(() => {
    addItem.mockReset();
    currentProduct = keyCards;
  });

  it("puts the server's cap sentence in the region when Add to Cart is refused", async () => {
    addItem.mockRejectedValue(
      new ApiError(422, 'Up to 4 packs per order here. For larger runs contact Single Source RGI.'),
    );
    renderPage();
    const add = await screen.findByRole('button', { name: 'Add to Cart' });
    await userEvent.click(add);
    await waitFor(() =>
      expect(screen.getByTestId('status-region')).toHaveTextContent(
        'Up to 4 packs per order here. For larger runs contact Single Source RGI.',
      ),
    );
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
  });

  it('says what was added when it succeeds', async () => {
    addItem.mockResolvedValue(undefined);
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Add to Cart' }));
    await waitFor(() =>
      expect(screen.getByTestId('status-region')).toHaveTextContent('Added to your cart: Key Cards'),
    );
  });

  it('says why Add to Cart is disabled while a pack has no recipient, and wires it to the button', async () => {
    currentProduct = businessCards;
    renderPage();
    const add = await screen.findByRole('button', { name: 'Add to Cart' });
    expect(add).toBeDisabled();
    expect(add).toHaveAccessibleDescription('Add a name, email and phone for each pack');
    expect(screen.getByText('Add a name, email and phone for each pack')).toBeInTheDocument();
  });
});
