import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/client';
import FloorPage from '../FloorPage';
import type { StationView } from '../../../types/production';

/** Day 5, Part B: the station view. A scan in the right order moves the
 * step (the arrived call carries the remembered station and person); a scan
 * out of order shows the server's refusal on screen, as worded. */

const step = (position: number, name: string, state: 'pending' | 'at' | 'done') => ({
  id: `s${position}`, production_unit_id: 'u-139', position, name, owner_kind: 'station' as const, owner_id: null, state, entered_at: null, left_at: null, note: null,
});
let card: StationView;
const getStationView = vi.fn(() => Promise.resolve(card));
const scanArrived = vi.fn();
vi.mock('../../../api/production', () => ({
  getStationView: (...args: unknown[]) => getStationView(...(args as [])),
  listStationScans: vi.fn(() => Promise.resolve([])),
  scanArrived: (...args: unknown[]) => scanArrived(...(args as [])),
  scanDone: vi.fn(),
  holdFromStation: vi.fn(),
}));

beforeEach(() => {
  window.localStorage.setItem('teaky.floor.station', 'Cutter');
  window.localStorage.setItem('teaky.floor.person', 'D.');
  card = {
    unit_id: 'u-139', batch_number: 139, stock: '120#', docket_number: '86993',
    steps: [step(1, 'Prepress', 'done'), step(2, 'Press', 'done'), step(3, 'Cut', 'pending'), step(4, 'Pack', 'pending')],
    expected: step(3, 'Cut', 'pending'), expected_scan: 'arrived', held: false,
  };
  getStationView.mockClear();
  scanArrived.mockReset();
});

async function scanTicket() {
  render(
    <MemoryRouter>
      <FloorPage />
    </MemoryRouter>,
  );
  const field = await screen.findByLabelText('Scan the batch ticket');
  await userEvent.type(field, 'u-139{enter}');
  await screen.findByTestId('station-card');
}

describe('Floor, the station view', () => {
  it('a scan in the right order moves the step with the remembered station and person', async () => {
    scanArrived.mockImplementation(() => {
      card = { ...card, steps: [step(1, 'Prepress', 'done'), step(2, 'Press', 'done'), step(3, 'Cut', 'at'), step(4, 'Pack', 'pending')], expected: step(3, 'Cut', 'at'), expected_scan: 'done' };
      return Promise.resolve({ unit_id: 'u-139', batch_number: 139, step: step(3, 'Cut', 'at'), scanned_at: new Date().toISOString(), scanned_by: 'D.', station: 'Cutter', next_expected: step(3, 'Cut', 'at') });
    });
    await scanTicket();
    expect(screen.getByText(/Docket 86993/)).toBeTruthy();
    const arrived = screen.getByTestId('scan-arrived');
    expect(arrived).toHaveTextContent('Arrived at Cut');
    expect(arrived).not.toBeDisabled();
    expect(screen.getByTestId('scan-done')).toBeDisabled();
    await userEvent.click(arrived);
    await waitFor(() => expect(scanArrived).toHaveBeenCalledWith('u-139', 3, 'D.', 'Cutter'));
    expect(await screen.findByText(/Batch 139 arrived at Cut — D\., Cutter/)).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId('scan-done')).not.toBeDisabled());
    expect(screen.getByTestId('scan-done')).toHaveTextContent('Done — to Pack');
  });

  it('a scan out of order shows the refusal as the server words it', async () => {
    scanArrived.mockImplementation(() => Promise.reject(new ApiError(409, "Refused: scanned arrived at step 3, but the expected step is 1 'Prepress' (pending).")));
    await scanTicket();
    await userEvent.click(screen.getByTestId('scan-arrived'));
    const refusal = await screen.findByTestId('floor-refusal');
    expect(refusal).toHaveTextContent("Refused: scanned arrived at step 3, but the expected step is 1 'Prepress' (pending).");
  });
});
