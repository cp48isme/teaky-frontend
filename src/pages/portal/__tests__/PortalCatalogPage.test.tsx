import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PortalCatalogPage from '../PortalCatalogPage';
import type { Product } from '../../../types/product';

// Buyer-journey item 5 (2026-09-25): filter chips come from the portal's own
// product categories, humanised, instead of a fixed apparel-shop list.

const base = { sizes: [], colors: [], pricing_tiers: [], mockup_urls: [] };
const products = [
  { ...base, id: 'p1', name: 'Parking Passes', category: 'parking' },
  { ...base, id: 'p2', name: 'Breakfast Coupons', category: 'guest_collateral' },
  { ...base, id: 'p3', name: 'Business Cards', category: 'stationery' },
] as unknown as Product[];
vi.mock('../../../contexts/PortalContext', () => ({
  usePortalContext: () => ({ portal: { name: 'The Raphael Hotel', slug: 'raphael', brand_config: null }, products, loading: false }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/p/raphael/products']}>
      <Routes>
        <Route path="/p/:slug/products" element={<PortalCatalogPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PortalCatalogPage', () => {
  it('derives the chips from the products and humanises the slugs', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Parking' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guest collateral' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stationery' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Apparel' })).not.toBeInTheDocument();
    expect(screen.queryByText('guest_collateral')).not.toBeInTheDocument();
  });

  it('filters to the chosen category', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Guest collateral' }));
    expect(screen.getByText('Breakfast Coupons')).toBeInTheDocument();
    expect(screen.queryByText('Parking Passes')).not.toBeInTheDocument();
  });
});
