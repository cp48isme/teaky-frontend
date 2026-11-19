import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatchesPage from '../BatchesPage';
import type { BatchSummary } from '../../../types/production';

/** t05 (19 Nov 2026): one search bar on Batches, in the head row, with the
 * orders page's words and behaviour (a substring over the visible fields);
 * the whole batch card is the link to its push-out page for staff, the footer
 * "its lines" kept as the secondary action; a read-only reader gets neither. */

const batch = (over: Partial<BatchSummary>): BatchSummary => ({
  unit_id: 'u-101', batch_number: 101, scan_code: 'K7M2Q9XA', business_entities: ['single_source'], stock: '120#', channel: 'press_run',
  used: 24, capacity: 24, blanks: 0, full: true, orders: 8, lines: 8, channels: ['press_run'], oldest_line_ref: 'W678797', oldest_line_age_seconds: 13 * 86400,
  release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false, fill_candidates: [], fillable_slots: 0, line_item_ids: ['l1'], tags: [], ...over,
});
const batches = [batch({}), batch({ unit_id: 'u-102', batch_number: 102, scan_code: '44RJBPZS', stock: '16 C2S', oldest_line_ref: 'W680797' })];
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({ ...(await vi.importActual<typeof import('react-router-dom')>('react-router-dom')), useNavigate: () => mockNavigate }));
vi.mock('../../../api/production', () => ({ listBatches: vi.fn(() => Promise.resolve(batches)), markHalfBatch: vi.fn(), getProductionSettings: vi.fn(() => Promise.resolve({ production_view: 'cards' })) }));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])), proposeAction: vi.fn(), approveProposal: vi.fn(), declineProposal: vi.fn() }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'S', mark: { url: 'x', alt: 'S', source: 'shop_profile' } })) }));

function mount(readOnly = false) {
  return render(
    <MemoryRouter>
      <BatchesPage readOnly={readOnly} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  localStorage.clear();
});

describe('the production search and the card link', () => {
  it('the search bar sits in the head row with the orders page words and narrows the cards by any visible field', async () => {
    const user = userEvent.setup();
    mount();
    await waitFor(() => expect(screen.getAllByTestId('batch-card').length).toBe(2));
    const box = screen.getByTestId('production-search');
    expect(box).toHaveAttribute('placeholder', 'PO, product, any field');
    await user.type(box, 'c2s');
    expect(screen.getAllByTestId('batch-card').length).toBe(1);
    expect(screen.getByTestId('batch-card')).toHaveTextContent('102');
    await user.clear(box);
    await user.type(box, 'w6787');
    expect(screen.getAllByTestId('batch-card').map((c) => c.textContent)).toEqual([expect.stringContaining('101')]);
    await user.clear(box);
    expect(screen.getAllByTestId('batch-card').length).toBe(2);
  });

  it('the whole card opens the batch for staff; the footer link stays; a read-only card is not a link', async () => {
    const user = userEvent.setup();
    mount();
    await waitFor(() => expect(screen.getAllByTestId('batch-card').length).toBe(2));
    const second = screen.getAllByTestId('batch-card')[1]!;
    expect(second).toHaveAttribute('role', 'link');
    await user.click(within(second).getByText('44RJBPZS'));
    expect(mockNavigate).toHaveBeenCalledWith('/production/batches/u-102/push-out');
    expect(within(second).getByRole('link', { name: 'its lines' })).toHaveAttribute('href', '/production/orders');
    mockNavigate.mockClear();
    await user.click(within(second).getByRole('link', { name: 'its lines' }));
    expect(mockNavigate).not.toHaveBeenCalled(); // the footer link is its own action
  });

  it('a read-only reader gets plain cards', async () => {
    mount(true);
    await waitFor(() => expect(screen.getAllByTestId('batch-card').length).toBe(2));
    for (const card of screen.getAllByTestId('batch-card')) expect(card).not.toHaveAttribute('role');
  });
});
