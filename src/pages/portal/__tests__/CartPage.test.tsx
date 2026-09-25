import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import CartPage from '../CartPage';
import type { Cart } from '../../../types/cart';
import type { Product } from '../../../types/product';

// Buyer-journey items 2 and 3 (2026-09-25): the cart names the product and shows
// no freight charge under invoice terms.

const products = [
  { id: 'prod-pp', name: 'Parking Passes', category: 'parking' } as Product,
  { id: 'prod-bc', name: 'Business Cards', category: 'stationery' } as Product,
];
const cart: Cart = {
  id: 'cart-1',
  portal_id: 'portal-1',
  user_id: 'user-1',
  status: 'active',
  items: [
    { id: 'i1', cart_id: 'cart-1', product_id: 'prod-pp', quantity: 1000, size: null, color: null, unit_price: 0.07, options: null, created_at: '' },
    { id: 'i2', cart_id: 'cart-1', product_id: 'prod-bc', quantity: 500, size: null, color: null, unit_price: 0.19, options: null, created_at: '' },
  ],
  subtotal: 165,
  created_at: '',
  updated_at: '',
};
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael Hotel', slug: 'raphael', brand_config: null }, products, loading: false }),
}));
vi.mock('../../../contexts/CartContext', () => ({
  useCart: () => ({ cart, loading: false, updateItem: vi.fn(), removeItem: vi.fn() }),
}));

describe('CartPage', () => {
  it('names each line by product and shows freight as billed later, not $9.99', () => {
    render(
      <MemoryRouter initialEntries={['/p/raphael/cart']}>
        <Routes>
          <Route path="/p/:slug/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Parking Passes')).toBeInTheDocument();
    expect(screen.getByText('Business Cards')).toBeInTheDocument();
    expect(screen.queryByText('Product')).not.toBeInTheDocument();
    expect(screen.getByText('Freight')).toBeInTheDocument();
    expect(screen.getByText('Billed at cost on your invoice')).toBeInTheDocument();
    expect(screen.queryByText('$9.99')).not.toBeInTheDocument();
    // Subtotal and total agree because no freight is added.
    expect(screen.getAllByText('$165.00')).toHaveLength(2);
  });
});
