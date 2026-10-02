import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { KeepPriceButton, MarkupBadge } from '../ProductPricingCells';
import type { Product } from '../../../types/product';

// S87: the admin grid shows the markup the price gives today against its
// floor, flags a breach awaiting a decision, and "Keep price" records it.

const confirmProductPrice = vi.fn();
vi.mock('../../../api/products', () => ({
  confirmProductPrice: (...args: unknown[]) => confirmProductPrice(...args),
  updateProduct: vi.fn(),
}));

describe('MarkupBadge', () => {
  it('flags a breach awaiting a decision', () => {
    render(<MarkupBadge effective="1.294" floor="1.400" belowFloor pending />);
    expect(screen.getByText('1.29×')).toBeInTheDocument();
    expect(screen.getByText('floor 1.40×')).toBeInTheDocument();
    expect(screen.getByText('Below floor — decide')).toBeInTheDocument();
  });

  it('shows a kept price as decided, not pending', () => {
    render(<MarkupBadge effective="1.294" floor="1.400" belowFloor pending={false} />);
    expect(screen.queryByText('Below floor — decide')).not.toBeInTheDocument();
    expect(screen.getByText('below floor, price kept')).toBeInTheDocument();
  });
});

describe('KeepPriceButton', () => {
  it('confirms the price (or one option) and hands back the updated product', async () => {
    const updated = { id: 'p1', floor_alert_pending: false } as Product;
    confirmProductPrice.mockResolvedValue(updated);
    const onUpdated = vi.fn();
    render(<KeepPriceButton portalId="portal-1" product={{ id: 'p1' } as Product} optionLabel="RFID" onUpdated={onUpdated} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Keep price' }));
    expect(confirmProductPrice).toHaveBeenCalledWith('portal-1', 'p1', 'RFID');
    expect(onUpdated).toHaveBeenCalledWith(updated);
  });
});
