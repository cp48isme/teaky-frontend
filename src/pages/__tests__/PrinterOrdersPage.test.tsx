import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PrinterOrdersPage from '../PrinterOrdersPage';

// Cause 6 (30 Oct 2026): orders can be found by Teaky order number, RGI
// number or portal name — the grid's search box and rule, not a second one.

const orders = [
  { id: 'o1', order_number: 'ORD-41BD4C83', rgi_order_number: '12345', portal_id: 'p1', placed_at: '2026-10-28T18:00:00Z', line_items: [{}], total: '75.00', status: 'submitted' },
  { id: 'o2', order_number: 'ORD-2C009FD6', rgi_order_number: null, portal_id: 'p2', placed_at: '2026-10-28T18:30:00Z', line_items: [{}, {}], total: '420.00', status: 'in_production' },
];
vi.mock('../../api/orders', () => ({ listPrinterOrders: vi.fn(() => Promise.resolve(orders)) }));
vi.mock('../../api/portals', () => ({
  listPortals: vi.fn(() => Promise.resolve([{ id: 'p1', name: 'Sandbox Hotel (test portal)' }, { id: 'p2', name: 'The Raphael' }])),
}));
vi.mock('../../lib/releaseCopy', () => ({ isHeld: () => false, describeRelease: () => null }));

function renderPage() {
  return render(
    <MemoryRouter>
      <PrinterOrdersPage />
    </MemoryRouter>,
  );
}

describe('PrinterOrdersPage — search', () => {
  it('finds an order by a partial, any-case Teaky number, RGI number or portal name', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText('ORD-41BD4C83')).toBeInTheDocument();
    expect(await screen.findByText('The Raphael')).toBeInTheDocument();
    const box = screen.getByRole('searchbox', { name: 'Search orders' });
    await user.type(box, '2c009');
    expect(screen.queryByText('ORD-41BD4C83')).not.toBeInTheDocument();
    expect(screen.getByText('ORD-2C009FD6')).toBeInTheDocument();
    await user.clear(box);
    await user.type(box, '123');
    expect(screen.getByText('ORD-41BD4C83')).toBeInTheDocument();
    expect(screen.queryByText('ORD-2C009FD6')).not.toBeInTheDocument();
    await user.clear(box);
    await user.type(box, 'raphael');
    expect(screen.getByText('ORD-2C009FD6')).toBeInTheDocument();
    expect(screen.queryByText('ORD-41BD4C83')).not.toBeInTheDocument();
    await user.clear(box);
    await user.type(box, 'nothing-like-this');
    expect(screen.getByText('No orders match “nothing-like-this”.')).toBeInTheDocument();
  });
});
