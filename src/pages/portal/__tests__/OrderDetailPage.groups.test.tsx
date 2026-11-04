import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import OrderDetailPage from '../OrderDetailPage';

// RGI build plan group B: the buyer's order page shows a section per shipment
// group with the group's proof status in the buyer's words — read from the
// model as deployed (the awaiting_proof hold on the unit, the lines' proof
// status), nothing new stored.

const { menu, passes, unit } = vi.hoisted(() => {
  const menu = { id: 'li-menu', product_id: 'p1', product_name: 'Breakfast Menu', quantity: 2, unit_price: 10, line_total: 20, size: null, color: null, needs_proof: true, proof_status: 'pending' };
  const passes = { id: 'li-passes', product_id: 'p2', product_name: 'Parking Passes', quantity: 1000, unit_price: 0.07, line_total: 70, size: null, color: null, needs_proof: false, proof_status: null };
  const unit = (over: object) => ({
    id: 'u', organization_id: 'o', portal_id: 'p', source_order_id: 'o1', kind: 'shipment', formation: 'split', channel: 'hotel_portal',
    ordinal: 1, partition_key: null, release_state: null, release_attempts: 0, released_at: null, released_by_id: null, frozen_at: null,
    reference: 'ORD-1-1', references: [], subtotal: '0', freight: '0', tax: '0', total: '0', cancelled_at: null, cancel_reason: null,
    line_item_ids: [], holds: [], created_at: '2026-11-03', updated_at: '2026-11-03', ...over,
  });
  return { menu, passes, unit };
});

vi.mock('../../../api/orders', () => ({
  getMyOrder: vi.fn().mockResolvedValue({
    id: 'o1', order_number: 'ORD-1', status: 'submitted', payment_method: 'invoice',
    subtotal: 90, shipping_cost: 0, tax_amount: 0, total: 90, po_number: null, notes: null, tracking_number: null, production_status: null,
    shipping_address: { name: 'Front Desk', line1: '325 Ward Pkwy', city: 'Kansas City', state: 'MO', postal_code: '64112', country: 'US' },
    line_items: [menu, passes],
    release_units: [
      unit({ id: 'u1', ordinal: 1, line_item_ids: ['li-passes'], frozen_at: '2026-11-03T15:00:00Z' }),
      unit({ id: 'u2', ordinal: 2, line_item_ids: ['li-menu'], release_state: 'held_for_proof',
        holds: [{ id: 'h1', reason: 'awaiting_proof', line_item_id: 'li-menu', case_key: null, detail: 'Breakfast Menu', opened_at: '2026-11-03', opened_by: 'planner', cleared_at: null, cleared_by_id: null, cleared_how: null, evidence_kind: null, evidence_note: null, answer: null, prior_decision: null }] }),
    ],
  }),
}));
vi.mock('../../../api/shipping', () => ({ getTrackingInfo: vi.fn() }));
vi.mock('../../../contexts/CartContext', () => ({ useCart: () => ({ addItem: vi.fn() }) }));
vi.mock('../../../contexts/PortalContext', () => ({ usePortalContext: () => ({ products: [] }) }));

describe('OrderDetailPage — groups and their proof status', () => {
  it('shows one section per shipment group with the proof status in the buyer’s words', async () => {
    render(
      <MemoryRouter initialEntries={['/p/raphael/orders/o1']}>
        <Routes>
          <Route path="/p/:slug/orders/:orderId" element={<OrderDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('ORD-1')).toBeInTheDocument();
    const groups = screen.getAllByTestId('buyer-group');
    expect(groups).toHaveLength(2);
    expect(within(groups[0]).getByText('Group 1 of 2')).toBeInTheDocument();
    expect(within(groups[0]).getByTestId('buyer-group-status')).toHaveTextContent('No proof needed — sent to the printer.');
    expect(within(groups[0]).getByText('Parking Passes')).toBeInTheDocument();
    expect(within(groups[1]).getByText('Group 2 of 2')).toBeInTheDocument();
    expect(within(groups[1]).getByTestId('buyer-group-status')).toHaveTextContent(
      'Waiting for your proof: Breakfast Menu. Nothing in this group prints until you approve it.',
    );
    expect(within(groups[1]).getByText('Breakfast Menu')).toBeInTheDocument();
    // Buyer vocabulary: never "held" or "released".
    for (const g of groups) expect(g.textContent).not.toMatch(/\b(held|released)\b/i);
  });
});
