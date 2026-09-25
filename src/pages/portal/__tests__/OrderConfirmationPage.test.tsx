import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import OrderConfirmationPage from '../OrderConfirmationPage';

// Buyer-journey item 4 (2026-09-25): the PO and notes the buyer typed are shown
// back on the confirmation page.

vi.mock('../../../api/orders', () => ({
  getMyOrder: vi.fn().mockResolvedValue({
    id: 'o1',
    order_number: 'ORD-53E7C1B0',
    status: 'submitted',
    total: 70,
    po_number: '5118824933',
    notes: 'Reprint, no changes',
    line_items: [{ id: 'li1', product_name: 'Parking Passes', quantity: 1000 }],
  }),
}));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael Hotel', slug: 'raphael', brand_config: null }, products: [], loading: false }),
}));

describe('OrderConfirmationPage', () => {
  it('echoes the PO number and notes and humanises the status', async () => {
    render(
      <MemoryRouter initialEntries={['/p/raphael/orders/o1/confirmation']}>
        <Routes>
          <Route path="/p/:slug/orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('ORD-53E7C1B0')).toBeInTheDocument();
    expect(screen.getByText('5118824933')).toBeInTheDocument();
    expect(screen.getByText('Reprint, no changes')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });
});
