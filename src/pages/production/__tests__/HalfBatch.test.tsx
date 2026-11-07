import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import BatchesPage, { halfBatchOffered } from '../BatchesPage';
import type { BatchSummary } from '../../../types/production';

/** Andrew, 6 Nov 2026: a batch at 12 or fewer slots used offers a half
 * batch (12 at 125 sheets); the press goes through the same confirmation. */

function batch(over: Partial<BatchSummary>): BatchSummary {
  return {
    unit_id: 'u-143', batch_number: 143, stock: '16 C2S', channel: 'press_run', used: 9, capacity: 24, blanks: 15, full: false, orders: 2, lines: 2, channels: ['press_run'],
    oldest_line_ref: 'W621723', oldest_line_age_seconds: 7 * 86400, release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false,
    fill_candidates: [], fillable_slots: 0, line_item_ids: [], ...over,
  };
}

const markHalfBatch = vi.fn(() => Promise.resolve({}));
vi.mock('../../../api/production', () => ({
  listBatches: vi.fn(() => Promise.resolve([batch({})])),
  markHalfBatch: (...args: unknown[]) => markHalfBatch(...(args as [])),
}));

describe('the half batch', () => {
  it('is offered at 12 or fewer slots used, never on a full, pushed or already-half batch', () => {
    expect(halfBatchOffered(batch({ used: 9 }))).toBe(true);
    expect(halfBatchOffered(batch({ used: 12 }))).toBe(true);
    expect(halfBatchOffered(batch({ used: 13 }))).toBe(false);
    expect(halfBatchOffered(batch({ used: 24, full: true }))).toBe(false);
    expect(halfBatchOffered(batch({ used: 9, docket_number: '86784' }))).toBe(false);
    expect(halfBatchOffered(batch({ used: 9, half: true }))).toBe(false);
    expect(halfBatchOffered(batch({ used: 0 }))).toBe(false);
  });

  it('pressing it marks the batch half and goes to the confirmation', async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches']}>
        <Routes>
          <Route path="/production/batches" element={<BatchesPage />} />
          <Route path="/production/batches/:unitId/push-out" element={<div>confirmation for u-143</div>} />
        </Routes>
      </MemoryRouter>,
    );
    const press = await screen.findByRole('button', { name: 'Half batch (12 at 125 sheets)…' });
    await userEvent.click(press);
    await waitFor(() => expect(markHalfBatch).toHaveBeenCalledWith('u-143'));
    expect(await screen.findByText('confirmation for u-143')).toBeInTheDocument();
  });
});
