import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderCostsPanel from '../OrderCostsPanel';
import type { OrderCosts } from '../../../types/orderCosts';

// S88 §5.3: the printer-side cost panel shows each line's cost basis as
// placed, lets staff fill decoration and freight, and sends only the fields
// they changed. Rule: the numbers shown are the snapshot, not the product's
// current cost.

const costs: OrderCosts = {
  order_id: 'ord-1',
  order_number: 'ORD-TEST1',
  status: 'submitted',
  outbound_freight_cost: null,
  processing_fee_actual: null,
  processing_fee_source: null,
  invoice_month: null,
  revenue_share_rate_snapshot: 0.7,
  lines: [
    {
      line_item_id: 'li-1',
      product_name: 'Breakfast Door Hangers',
      quantity: 2,
      pack_size: 1000,
      unit_price: 420,
      line_total: 840,
      unit_cost: 285,
      cost_source: 'Single Source trade price',
      decoration_charge: null,
      inbound_freight_allocation: null,
    },
  ],
};

const getOrderCosts = vi.fn();
const updateOrderCosts = vi.fn();
const updateLineItemCosts = vi.fn();
vi.mock('../../../api/orderCosts', () => ({
  getOrderCosts: (...a: unknown[]) => getOrderCosts(...a),
  updateOrderCosts: (...a: unknown[]) => updateOrderCosts(...a),
  updateLineItemCosts: (...a: unknown[]) => updateLineItemCosts(...a),
}));

describe('OrderCostsPanel', () => {
  beforeEach(() => {
    getOrderCosts.mockReset().mockResolvedValue(costs);
    updateOrderCosts.mockReset().mockResolvedValue(costs);
    updateLineItemCosts.mockReset().mockResolvedValue(costs);
  });

  it('shows the cost snapshot and the gross profit from it', async () => {
    render(<OrderCostsPanel orderId="ord-1" subtotal={840} />);
    expect(await screen.findByText('Breakfast Door Hangers')).toBeInTheDocument();
    expect(screen.getByLabelText('Breakfast Door Hangers cost per pack')).toHaveValue('285');
    // 840 price − 2 × 285 cost = 270 GP, share rate 70 %
    expect(screen.getByText(/GP \$270\.00/)).toBeInTheDocument();
    expect(screen.getByText(/share rate 70%/)).toBeInTheDocument();
  });

  it('sends only the line fields staff filled', async () => {
    const user = userEvent.setup();
    render(<OrderCostsPanel orderId="ord-1" subtotal={840} />);
    await screen.findByText('Breakfast Door Hangers');
    await user.type(screen.getByLabelText('Breakfast Door Hangers decoration charge'), '40');
    await user.click(screen.getByRole('button', { name: 'Save line' }));
    expect(updateLineItemCosts).toHaveBeenCalledWith('ord-1', 'li-1', {
      unit_cost: 285,
      cost_source: 'Single Source trade price',
      decoration_charge: 40,
    });
  });

  it('sends the order-level freight and invoice month', async () => {
    const user = userEvent.setup();
    render(<OrderCostsPanel orderId="ord-1" subtotal={840} />);
    await screen.findByText('Breakfast Door Hangers');
    await user.type(screen.getByLabelText('Outbound freight (label cost)'), '13.25');
    await user.type(screen.getByLabelText(/Invoice month/), '2026-10-01');
    await user.click(screen.getByRole('button', { name: 'Save order costs' }));
    expect(updateOrderCosts).toHaveBeenCalledWith('ord-1', {
      outbound_freight_cost: 13.25,
      invoice_month: '2026-10-01',
    });
  });
});
