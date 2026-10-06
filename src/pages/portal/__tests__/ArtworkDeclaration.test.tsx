import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortalProductDetailPage from '../PortalProductDetailPage';

// S88: a proof-required product carries the buyer's artwork declaration —
// reprint unchanged, or changes with a note — and what they declared (never a
// guess) is what is sent with the line. Left unset, nothing is sent and the
// server decides from the hotel's order history.

const addItem = vi.fn().mockResolvedValue(undefined);
const doorHangers = {
  id: 'prod-dh',
  portal_id: 'portal-1',
  name: 'Breakfast Door Hangers',
  category: 'print',
  description: null,
  sku: 'RAPH-DH',
  category_id: null,
  sizes: [],
  colors: [],
  pricing_tiers: [],
  mockup_urls: [],
  min_order_qty: 1,
  pack_size: 1000,
  pack_price: 420,
  base_price: 420,
  price_confirmed_at: '2026-10-01T15:00:00Z',
  option_set_name: null,
  price_options: [],
  proof_required: true,
  status: 'active',
  sort_order: 0,
};

vi.mock('../../../api/portals', () => ({ getPublicProduct: vi.fn(() => Promise.resolve(doorHangers)) }));
vi.mock('../../../api/orders', () => ({ checkSafeOrder: vi.fn(() => Promise.resolve({ is_safe_order: false })) }));
vi.mock('../../../api/quotes', () => ({ createPortalQuote: vi.fn() }));
vi.mock('../../../api/uploads', () => ({ uploadFile: vi.fn() }));
vi.mock('../../../api/client', () => ({ isAuthenticated: () => true }));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael', slug: 'raphael', brand_config: null } }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/p/raphael/products/prod-dh']}>
      <Routes>
        <Route path="/p/:slug/products/:productId" element={<PortalProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PortalProductDetailPage — artwork declaration', () => {
  beforeEach(() => addItem.mockClear());

  it('sends the declared changes and note with the line', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('Artwork')).toBeInTheDocument();

    await user.click(screen.getByLabelText(/Changes needed/));
    await user.type(screen.getByLabelText('What changes?'), 'New phone number on the back');
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));

    expect(addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: 'prod-dh',
        artwork_disposition: 'changes_new_proof',
        artwork_change_note: 'New phone number on the back',
      }),
    );
    expect(addItem.mock.calls[0][0]).not.toHaveProperty('artwork_upload_url');
  });

  it('sends a reprint declaration without a note', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Artwork');
    await user.click(screen.getByLabelText(/Reprint exactly as last time/));
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({ artwork_disposition: 'reuse_unchanged' }));
    expect(addItem.mock.calls[0][0]).not.toHaveProperty('artwork_change_note');
  });

  it('sends no declaration when the buyer leaves it unset, so the server decides from history', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Artwork');
    expect(screen.getByText(/If you leave this unset/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(addItem.mock.calls[0][0]).not.toHaveProperty('artwork_disposition');
  });
});
