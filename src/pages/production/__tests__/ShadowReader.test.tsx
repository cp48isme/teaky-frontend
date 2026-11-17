import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import BatchesPage from '../BatchesPage';
import HeldPage from '../HeldPage';
import AllChannelOrdersPage from '../AllChannelOrdersPage';
import ProductionLayout from '../../../components/production/ProductionLayout';
import { isShadowReader } from '../../../lib/roles';
import type { HeldQueueEntry } from '../../../types/releaseUnit';
import type { BatchSummary, TaylorPoolLine } from '../../../types/production';

/** The shadow_reader (dispatch 16 Nov 2026, item 5): the three screens show
 * what the three routes it may read return — scan code and entity shown,
 * holds by reason — fetch nothing else, and offer no action. */

const batch: BatchSummary = {
  unit_id: 'u-101', batch_number: 101, scan_code: 'K7M2Q9XA', business_entities: ['single_source'], stock: '120#', channel: 'press_run',
  used: 24, capacity: 24, blanks: 0, full: true, orders: 8, lines: 8, channels: ['press_run'], oldest_line_ref: 'W7001234', oldest_line_age_seconds: 7200,
  release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false, fill_candidates: [], fillable_slots: 0, line_item_ids: ['l1'],
};
const held: HeldQueueEntry = {
  unit_id: 'u-9', scan_code: 'B4N8TJ2P', business_entity: 'single_source', kind: 'shipment', source_order_id: 'o1', order_number: 'ORD-9', reference: 'W7001240', release_state: null, age_seconds: 10800,
  open_holds: [
    { hold_id: 'h-1', reason: 'stock_unknown', detail: 'stock unknown for HF10ENV', line_item_id: 'l1', case_key: 'product_key:HF10ENV', prior_decision: null },
    { hold_id: 'h-2', reason: 'art_missing', detail: 'art not found', line_item_id: 'l1', case_key: 'line_item:l1', prior_decision: null },
  ],
};
const pool: TaylorPoolLine[] = [
  { id: 't1', po: 'W7001240', line_no: 1, product: 'HF10ENV', quantity: 4, pack: 500, cards: 2000, source_created_at: '2026-11-16T10:00:00Z', received_at: '2026-11-16T19:28:00Z', art_state: 'fetched', art_error: null, held_by: [], stock: '', line_item_id: 'l1', order_number: 'ORD-9', canonical_state: 'written', canonical_error: null },
];

const listPrinterOrders = vi.fn(() => Promise.reject(new Error('403 should not be called')));
const getProductionSettings = vi.fn(() => Promise.reject(new Error('403 should not be called')));
const getSpecSuggestion = vi.fn(() => Promise.reject(new Error('403 should not be called')));
vi.mock('../../../api/orders', () => ({ listPrinterOrders: () => listPrinterOrders() }));
vi.mock('../../../api/releaseUnits', () => ({
  listHeldQueue: vi.fn(() => Promise.resolve([held])),
  clearUnitHold: vi.fn(),
  splitHoldOnce: vi.fn(),
}));
vi.mock('../../../api/production', () => ({
  listBatches: vi.fn(() => Promise.resolve([batch])),
  listTaylorPool: vi.fn(() => Promise.resolve(pool)),
  getProductionSettings: () => getProductionSettings(),
  updateProductionSettings: vi.fn(),
  getSpecSuggestion: () => getSpecSuggestion(),
  pullTaylorNow: vi.fn(),
  markHalfBatch: vi.fn(),
}));

describe('the shadow_reader role', () => {
  it('is read-only only when shadow_reader is the one production role held', () => {
    expect(isShadowReader(['shadow_reader'])).toBe(true);
    expect(isShadowReader(['shadow_reader', 'printer_admin'])).toBe(false);
    expect(isShadowReader(['printer_admin'])).toBe(false);
    expect(isShadowReader([])).toBe(false);
  });

  it('Batches: the list as returned, scan code and entity shown, no push-out, half-batch or move', async () => {
    render(
      <MemoryRouter>
        <BatchesPage readOnly />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('scan-code')).toHaveTextContent('K7M2Q9XA');
    expect(screen.getByTestId('entity')).toHaveTextContent('single_source');
    expect(screen.queryByRole('button', { name: /Push out/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Half batch/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Move orders/ })).toBeNull();
    expect(screen.getByTestId('read-only-note')).toHaveTextContent('Read-only view');
  });

  it('Held: the queue with holds by reason, scan code and entity; no decision form, no fetch now; nothing else fetched', async () => {
    render(
      <MemoryRouter>
        <HeldPage readOnly />
      </MemoryRouter>,
    );
    const table = await screen.findByTestId('read-only-held');
    expect(table).toHaveTextContent('holds by reason: stock_unknown 1 · art_missing 1');
    expect(table).toHaveTextContent('B4N8TJ2P');
    expect(table).toHaveTextContent('single_source');
    expect(await screen.findByTestId('held-stock_unknown')).toHaveTextContent('Stock unknown');
    expect(screen.queryByTestId('decision-stock_unknown')).toBeNull();
    expect(screen.queryByRole('button', { name: /answer and place it/ })).toBeNull();
    expect(screen.queryByText('fetch now')).toBeNull();
    await waitFor(() => expect(screen.getByText(/No art file yet/)).toBeInTheDocument());
    expect(listPrinterOrders).not.toHaveBeenCalled();
    expect(getProductionSettings).not.toHaveBeenCalled();
    expect(getSpecSuggestion).not.toHaveBeenCalled();
  });

  it('All Channel Orders: every pool row, from the pool and the batches, never the orders list', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage readOnly />
      </MemoryRouter>,
    );
    expect(await screen.findByText('HF10ENV')).toBeInTheDocument();
    expect(screen.getByText('W7001240')).toBeInTheDocument();
    expect(listPrinterOrders).not.toHaveBeenCalled();
  });

  it('the shell shows only the three screens to a shadow_reader', () => {
    render(
      <MemoryRouter>
        <ProductionLayout readOnly>
          <div>x</div>
        </ProductionLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Batches' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Held' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All Channel Orders' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Floor' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Products' })).toBeNull();
  });
});
