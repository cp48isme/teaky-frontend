import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatchesPage from '../BatchesPage';
import type { BatchSummary } from '../../../types/production';

/** The list view (a26, 18 Nov 2026): cards by default (RGI untouched); the
 * shop's production setting opens the list; the browser's toggle overrides
 * either and is remembered; the list carries the design's columns; the tag
 * chips keep or drop batches by their orders' tags, exclude winning. */

const batch = (over: Partial<BatchSummary>): BatchSummary => ({
  unit_id: 'u-101', batch_number: 101, scan_code: 'K7M2Q9XA', business_entities: ['single_source'], stock: '120#', channel: 'press_run',
  used: 24, capacity: 24, blanks: 0, full: true, orders: 8, lines: 8, channels: ['press_run'], oldest_line_ref: 'W678797', oldest_line_age_seconds: 13 * 86400,
  release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false, fill_candidates: [], fillable_slots: 0, line_item_ids: ['l1'], tags: ['Express'], ...over,
});
const batches = [batch({}), batch({ unit_id: 'u-102', batch_number: 102, scan_code: '44RJBPZS', used: 23, full: false, blanks: 1, tags: [], oldest_line_ref: 'W680797', oldest_line_age_seconds: 10 * 86400 })];
let shopView: 'cards' | 'list' = 'cards';
const getProductionSettings = vi.fn(() => Promise.resolve({ split_when_unplaceable: true, gang_whole_orders: true, hold_age_days: 3, shop_name: 'S', timezone: 'UTC', production_view: shopView }));
vi.mock('../../../api/production', () => ({
  listBatches: vi.fn(() => Promise.resolve(batches)),
  markHalfBatch: vi.fn(),
  getProductionSettings: () => getProductionSettings(),
}));
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
  localStorage.clear();
  shopView = 'cards';
  getProductionSettings.mockClear();
});

describe('the batches list view', () => {
  it('opens on cards by default and the toggle switches to the list, remembered for this browser', async () => {
    const user = userEvent.setup();
    mount();
    await waitFor(() => expect(screen.getAllByText(/W678797/).length).toBeGreaterThan(0));
    expect(screen.queryByTestId('batches-table')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'List' }));
    const table = await screen.findByTestId('batches-table');
    expect(within(table).getAllByTestId('batch-row').length).toBe(2);
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent?.replace(/ [▲▼]$/, ''))).toEqual(['Batch', 'Scan code', 'Stock', 'Slots', 'Orders · lines', 'Oldest line', 'Entity', 'Tags', 'State']);
    const first = within(table).getAllByTestId('batch-row')[0]!;
    expect(first).toHaveTextContent('101');
    expect(first).toHaveTextContent('24 / 24 · full');
    expect(first).toHaveTextContent('Express');
    expect(within(first).getByRole('link', { name: '101' })).toHaveAttribute('href', '/production/batches/u-101/push-out');
    expect(localStorage.getItem('teaky.production.view')).toBe('list');
  });

  it("opens on the list when the shop's setting says so, and a read-only reader gets rows without links", async () => {
    shopView = 'list';
    const staff = mount();
    expect(await screen.findByTestId('batches-table')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: '101' })).toBeTruthy();
    staff.unmount();
    localStorage.setItem('teaky.production.view', 'list');
    mount(true);
    expect(await screen.findByTestId('batches-table')).toBeTruthy();
    expect(getProductionSettings).toHaveBeenCalledTimes(1); // the reader never asks for the setting
    expect(screen.queryAllByRole('link', { name: '101' })).toEqual([]);
  });

  it('the tag chips keep or drop batches by their orders tags; exclude wins', async () => {
    const user = userEvent.setup();
    localStorage.setItem('teaky.production.view', 'list');
    mount();
    const table = await screen.findByTestId('batches-table');
    expect(within(table).getAllByTestId('batch-row').length).toBe(2);
    const chip = within(screen.getByTestId('tag-chips')).getByRole('button', { name: 'Express' });
    await user.click(chip); // only Express
    expect(within(table).getAllByTestId('batch-row').length).toBe(1);
    await user.click(chip); // without Express
    expect(within(table).getAllByTestId('batch-row').map((r) => r.textContent)).toEqual(expect.arrayContaining([expect.stringContaining('102')]));
    expect(within(table).getAllByTestId('batch-row').length).toBe(1);
    await user.click(chip); // off
    expect(within(table).getAllByTestId('batch-row').length).toBe(2);
  });
});
