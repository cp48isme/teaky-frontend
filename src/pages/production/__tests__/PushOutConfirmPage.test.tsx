import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PushOutConfirmPage from '../PushOutConfirmPage';
import type { PushOutPreview } from '../../../types/production';

const preview: PushOutPreview = {
  unit_id: 'u-139', batch_number: 139, stock: '120#', used: 24, capacity: 24, blanks: 0, orders: 7, lines: 9,
  docket_send_enabled: false, docket_host: null, existing_docket_number: null,
  payload: { service_name: 'Taylor Interface', service_transaction_id: 't', service_url: 'https://x', customer_id: '2908', customer_name: 'RGI Publications', contact_name: 'Jeni', contact_phone: '', contact_email: '', order_id: '139', order_date: '11/6/2026 09:00:00 AM', order_name: 'BC Batch120# 139', item_code: '18503', item_name: 'BC Batch120# 139', quantity: 250, item_total: '480.00', description: 'W1 W2', pos: ['W1', 'W2'], cards: 6000 },
  payload_xml: '<?xml version="1.0"?><ImportOrderRequest><OrderName>BC Batch120# 139</OrderName></ImportOrderRequest>',
  payload_sha256: 'abc', payload_problem: null,
  files: [{ kind: 'job_ticket', filename: 'job-ticket-139.pdf', sha256: 'deadbeef', size_bytes: 38599 }],
};

let resolvePreview: (p: PushOutPreview) => void = () => {};
const pushOut = vi.fn(() => Promise.resolve({ unit_id: 'u-139', attempted_at: 'now', sent: false, docket_send_enabled: false, docket_number: null, needs_human: false, reason: 'docket_send_enabled is false', release_state: null, payload_sha256: 'abc' }));
vi.mock('../../../api/production', () => ({
  getPushOutPreview: vi.fn(() => new Promise<PushOutPreview>((resolve) => { resolvePreview = resolve; })),
  pushOut: (...args: unknown[]) => pushOut(...(args as [])),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/production/batches/u-139/push-out']}>
      <Routes>
        <Route path="/production/batches/:unitId/push-out" element={<PushOutConfirmPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('the push-out confirmation', () => {
  it('cannot be pressed before the Docket payload has rendered, and can after', async () => {
    renderPage();
    // Before the preview arrives there is no confirm button to press at all.
    expect(screen.queryByRole('button', { name: /Confirm — push out/ })).toBeNull();
    resolvePreview(preview);
    const button = await screen.findByRole('button', { name: /Confirm — push out 139/ });
    // The payload is on screen, so the button is enabled; the files and blanks are shown.
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(screen.getByTestId('docket-payload').textContent).toContain('BC Batch120# 139');
    expect(screen.getByText('job-ticket-139.pdf')).toBeInTheDocument();
    expect(screen.getByText('Blanks').nextSibling?.textContent).toBe('0');
    expect(screen.getByText(/OFF — the payload is recorded, nothing is sent/)).toBeInTheDocument();
    await userEvent.setup().click(button);
    expect(pushOut).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Not sent: docket_send_enabled is false/)).toBeInTheDocument();
  });

  it('stays disabled when the payload cannot be built', async () => {
    renderPage();
    resolvePreview({ ...preview, payload: null, payload_xml: null, payload_sha256: null, payload_problem: 'docket customer not configured: no customer for hotel_portal' });
    const button = await screen.findByRole('button', { name: /Confirm — push out 139/ });
    expect(button).toBeDisabled();
    expect(screen.getByRole('alert').textContent).toContain('docket customer not configured');
    await userEvent.setup().click(button);
    expect(pushOut).toHaveBeenCalledTimes(1); // unchanged from the first test's one call
  });
});
