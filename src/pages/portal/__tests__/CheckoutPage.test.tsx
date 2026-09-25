import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutPage from '../CheckoutPage';
import type { Cart } from '../../../types/cart';
import type { PublicPortalResponse } from '../../../types/portal';

// S84 / plan §5.5 — the invoice-terms buyer path. Phase 1 hardcodes every portal
// as invoice-terms: the checkout places the order for later invoicing and never
// shows a payment step.

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../../api/orders', () => ({ createPortalOrder: vi.fn() }));
vi.mock('../../../api/checkout', () => ({ createPaymentIntent: vi.fn(), confirmCheckout: vi.fn() }));
vi.mock('../../../api/shipping', () => ({ getShippingRates: vi.fn().mockResolvedValue([]) }));
vi.mock('../../../components/checkout/StripePaymentForm', () => ({ default: () => <div>stripe-form</div> }));

let portal: PublicPortalResponse;
const cart: Cart = {
  id: 'cart-1',
  portal_id: 'portal-1',
  user_id: 'user-1',
  status: 'active',
  items: [
    {
      id: 'item-1',
      cart_id: 'cart-1',
      product_id: 'prod-1',
      product_name: 'Parking Passes',
      quantity: 1000,
      size: null,
      color: null,
      unit_price: 0.43,
      line_total: 430,
      created_at: '2026-09-25T00:00:00Z',
      updated_at: '2026-09-25T00:00:00Z',
    } as unknown as Cart['items'][number],
  ],
  subtotal: 430,
  created_at: '2026-09-25T00:00:00Z',
  updated_at: '2026-09-25T00:00:00Z',
};
const products = [{ id: 'prod-1', name: 'Parking Passes', category: 'parking' }];
vi.mock('../../../contexts/PortalContext', () => ({ usePortalContext: () => ({ portal, products, loading: false }) }));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ cart, loading: false, itemCount: 1 }) }));

import { createPortalOrder } from '../../../api/orders';
import { createPaymentIntent } from '../../../api/checkout';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/p/raphael/checkout']}>
      <Routes>
        <Route path="/p/:slug/checkout" element={<CheckoutPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillAddress(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full Name'), 'Front Desk');
  await user.type(screen.getByLabelText('Address Line 1'), '325 Ward Pkwy');
  await user.type(screen.getByLabelText('City'), 'Kansas City');
  await user.type(screen.getByLabelText('State'), 'MO');
  await user.type(screen.getByLabelText('ZIP Code'), '64112');
}

describe('CheckoutPage — invoice-terms buyer path', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    portal = { name: 'The Raphael Hotel', slug: 'raphael', brand_config: null, type: 'client', status: 'active', require_po: false };
    vi.mocked(createPortalOrder).mockResolvedValue({ id: 'order-9' } as never);
  });

  it('offers "Place order — to be invoiced" and never a payment step', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Place order — to be invoiced' })).toBeInTheDocument();
    expect(screen.queryByText('Continue to Payment')).not.toBeInTheDocument();
    expect(screen.getByText(/You will be invoiced for this order/)).toBeInTheDocument();
  });

  it('names the product in the summary and shows freight as billed later, never $9.99', () => {
    renderPage();
    expect(screen.getByText('Parking Passes')).toBeInTheDocument();
    expect(screen.queryByText(/^Shipping Method$/)).not.toBeInTheDocument();
    expect(screen.getAllByText('Billed at cost on your invoice').length).toBeGreaterThan(0);
    expect(screen.queryByText(/9\.99/)).not.toBeInTheDocument();
    // Line total, subtotal and total all agree because no freight is added.
    expect(screen.getAllByText('$430.00')).toHaveLength(3);
  });

  it('posts shipping, PO and notes to the create-order route with payment_method invoice and routes to confirmation', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillAddress(user);
    await user.type(screen.getByLabelText(/PO number or reference/), ' 5118824933 ');
    await user.type(screen.getByLabelText('Notes (optional)'), 'reprint, no changes');
    await user.click(screen.getByRole('button', { name: 'Place order — to be invoiced' }));
    await waitFor(() => expect(createPortalOrder).toHaveBeenCalledTimes(1));
    expect(vi.mocked(createPortalOrder).mock.calls[0][0]).toBe('raphael');
    expect(vi.mocked(createPortalOrder).mock.calls[0][1]).toMatchObject({
      cart_id: 'cart-1',
      payment_method: 'invoice',
      po_number: '5118824933',
      notes: 'reprint, no changes',
      shipping_address: expect.objectContaining({ name: 'Front Desk', line1: '325 Ward Pkwy', city: 'Kansas City', state: 'MO', postal_code: '64112' }),
    });
    expect(createPaymentIntent).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael/orders/order-9/confirmation');
  });

  it('blocks before placing when the portal requires a PO and none is given', async () => {
    portal = { ...portal, require_po: true };
    const user = userEvent.setup();
    renderPage();
    await fillAddress(user);
    const po = screen.getByLabelText(/PO number or reference/);
    expect(po).toBeRequired();
    expect(screen.getByText('(required)')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Place order — to be invoiced' }));
    // Native constraint validation stops the submit; the page never reaches the API.
    expect(po).toBeInvalid();
    expect(createPortalOrder).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows the server error and stays on the page when the order is refused', async () => {
    vi.mocked(createPortalOrder).mockRejectedValueOnce(new Error('Cart is empty'));
    const user = userEvent.setup();
    renderPage();
    await fillAddress(user);
    await user.click(screen.getByRole('button', { name: 'Place order — to be invoiced' }));
    expect(await screen.findByText('Cart is empty')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
