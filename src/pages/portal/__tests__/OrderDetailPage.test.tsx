import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import OrderDetailPage from '../OrderDetailPage';

// Buyer-journey items 4 and 6: a submitted invoice-terms order shows its PO and
// notes, freight as billed later, and offers Reorder without waiting for a
// completed/delivered status.

const addItem = vi.fn().mockResolvedValue(undefined);
vi.mock('../../../api/orders', () => ({
  getMyOrder: vi.fn().mockResolvedValue({
    id: 'o1', order_number: 'ORD-1', status: 'submitted', payment_method: 'invoice',
    subtotal: 70, shipping_cost: 0, tax_amount: 0, total: 70,
    po_number: '5118824933', notes: 'Reprint, no changes', tracking_number: null, production_status: null,
    shipping_address: { name: 'Front Desk', line1: '325 Ward Pkwy', city: 'Kansas City', state: 'MO', postal_code: '64112', country: 'US' },
    line_items: [{ id: 'li1', product_id: 'prod-pp', product_name: 'Parking Passes', quantity: 1000, unit_price: 0.07, line_total: 70, size: null, color: null, needs_proof: false, proof_status: null }],
  }),
}));
vi.mock('../../../api/shipping', () => ({ getTrackingInfo: vi.fn() }));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ products: [{ id: 'prod-pp', name: 'Parking Passes', pricing_tiers: [{ min_qty: 1, max_qty: null, unit_price: 0.08 }] }] }),
}));

describe('OrderDetailPage', () => {
  it('shows PO, notes and freight note, and reorders a submitted order at the current price', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/p/raphael/orders/o1']}>
        <Routes>
          <Route path="/p/:slug/orders/:orderId" element={<OrderDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('ORD-1')).toBeInTheDocument();
    expect(screen.getByText('5118824933')).toBeInTheDocument();
    expect(screen.getByText('Reprint, no changes')).toBeInTheDocument();
    expect(screen.getByText('Billed at cost on your invoice')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reorder' }));
    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({ product_id: 'prod-pp', quantity: 1000, unit_price: 0.08 }));
    expect(await screen.findByText(/1 item added to your cart at today's prices/)).toBeInTheDocument();
  });
});
