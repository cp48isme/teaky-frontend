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
    line_items: [{ id: 'li1', product_name: 'Parking Passes', quantity: 1000, needs_proof: false }],
  }),
}));
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({
    portal: { name: 'The Raphael Hotel', slug: 'raphael', brand_config: { support_name: 'RGI orders', support_email: 'orders@example.com', support_phone: null } },
    products: [], loading: false,
  }),
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

  it('says what happens next for a no-proof reprint on invoice terms and who to contact', async () => {
    render(
      <MemoryRouter initialEntries={['/p/raphael/orders/o1/confirmation']}>
        <Routes>
          <Route path="/p/:slug/orders/:orderId/confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('What happens next')).toBeInTheDocument();
    expect(screen.getByText(/No proof is needed: this is a reprint/)).toBeInTheDocument();
    expect(screen.getByText(/You will be invoiced after it ships/)).toBeInTheDocument();
    expect(screen.getByText('RGI orders · orders@example.com')).toBeInTheDocument();
  });
});
