import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PushOutConfirmPage, { orderLine, resultText, switchText } from '../PushOutConfirmPage';
import type { PushOutPreview } from '../../../types/production';

/** Push-out as one decision (ruling 26 Nov 2026; overnight dispatch item 2):
 * facts → the switch banner above the fold → what goes with it → the Docket
 * order in one line with its XML behind "Show the Docket XML" → Confirm /
 * Not now; after Confirm the result replaces the buttons with the sha, the
 * audit link and the two ways back. */

const preview: PushOutPreview = {
  unit_id: 'u-101', batch_number: 101, stock: 'BC 120#', used: 24, capacity: 24, blanks: 0, orders: 7, lines: 9,
  docket_send_enabled: false, docket_host: null, existing_docket_number: null,
  payload: { service_name: 'Taylor Interface', service_transaction_id: 't', service_url: 'https://x', customer_id: '2908', customer_name: 'RGI Publications', contact_name: 'Jeni', contact_phone: '', contact_email: '', order_id: '101', order_date: '11/27/2026 09:00:00 AM', order_name: 'Batch BC 120#', item_code: '18502', item_name: 'BC Batch120# 101', quantity: 250, item_total: '480.00', description: 'W1 W2', pos: ['W1', 'W2'], cards: 6000 },
  payload_xml: '<?xml version="1.0"?><ImportOrderRequest><OrderName>Batch BC 120#</OrderName></ImportOrderRequest>',
  payload_sha256: 'abc123def456abc123def456', payload_problem: null,
  files: [{ kind: 'job_ticket', filename: 'job-ticket-101.pdf', sha256: 'deadbeef', size_bytes: 38599 }],
};
const pushOut = vi.fn(() => Promise.resolve({ unit_id: 'u-101', attempted_at: 'now', sent: false, docket_send_enabled: false, docket_number: null, needs_human: false, reason: 'docket_send_enabled is false', release_state: null, payload_sha256: 'abc123def456abc123def456' }));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])), proposeAction: vi.fn(), approveProposal: vi.fn(), declineProposal: vi.fn() }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/production', () => ({
  getPushOutPreview: vi.fn(() => Promise.resolve(preview)),
  pushOut: (...args: unknown[]) => pushOut(...(args as [])),
}));

function mount() {
  return render(
    <MemoryRouter initialEntries={['/production/batches/u-101/push-out']}>
      <Routes>
        <Route path="/production/batches/:unitId/push-out" element={<PushOutConfirmPage />} />
        <Route path="/production/batches/:unitId" element={<div data-testid="batch-page">batch page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('push-out as one decision', () => {
  it('reads top to bottom: facts, the switch banner, what goes with it, the Docket order line with its XML collapsed, then Confirm / Not now', async () => {
    mount();
    const banner = await screen.findByTestId('docket-switch-banner');
    expect(banner).toHaveAttribute('data-docket-send', 'off');
    expect(banner).toHaveTextContent('Docket send is OFF for this shop. OFF — the payload is recorded, nothing is sent: confirming records this push-out on the batch, not in DocketManager.');
    const order = ['push-facts', 'docket-switch-banner', 'goes-with-it', 'docket-order', 'decision'].map((id) => screen.getByTestId(id));
    for (let i = 1; i < order.length; i++) expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByTestId('docket-order-line')).toHaveTextContent('Docket order for batch 101 — named Batch BC 120# in Docket (item 18502)');
    const details = screen.getByTestId('docket-xml') as HTMLDetailsElement;
    expect(details.open).toBe(false);
    expect(within(details).getByText('Show the Docket XML')).toBeInTheDocument();
    expect(screen.getByTestId('docket-payload').textContent).toContain('<OrderName>Batch BC 120#</OrderName>');
    expect(within(screen.getByTestId('goes-with-it')).getByText('job-ticket-101.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });

  it('after Confirm the result replaces the buttons: what happened, the sha, the audit link, Back to batch, Back to Batches', async () => {
    mount();
    const button = await screen.findByRole('button', { name: /Confirm — push out 101/ });
    await userEvent.click(button);
    const result = await screen.findByTestId('push-result');
    expect(result).toHaveTextContent('Not sent: docket_send_enabled is false');
    expect(result).toHaveTextContent('abc123def456abc123def456');
    expect(within(result).getByTestId('audit-link')).toHaveAttribute('href', '/production/batches/u-101#audit');
    expect(within(result).getByTestId('back-to-batch')).toHaveAttribute('href', '/production/batches/u-101');
    expect(within(result).getByTestId('back-to-batches')).toHaveAttribute('href', '/production/batches');
    expect(screen.queryByTestId('decision')).toBeNull();
    expect(screen.queryByRole('button', { name: /Confirm — push out/ })).toBeNull();
    expect(pushOut).toHaveBeenCalledTimes(1);
  });

  it('Not now goes back to the batch page', async () => {
    mount();
    await userEvent.click(await screen.findByRole('button', { name: 'Not now' }));
    expect(await screen.findByTestId('batch-page')).toBeInTheDocument();
  });

  it('the words: ON names the site; a sent result names the Docket number', () => {
    expect(switchText({ docket_send_enabled: true, docket_host: 'singlesourceus.docketmanager.net' })).toContain('ON for this shop — confirming sends this order to DocketManager at singlesourceus.docketmanager.net');
    expect(orderLine({ ...preview, payload: null })).toBe('Docket order for batch 101');
    expect(resultText({ unit_id: 'u', attempted_at: 'now', sent: true, docket_send_enabled: true, docket_number: '18502', needs_human: false, reason: null, release_state: 'released', payload_sha256: 'x' })).toBe('Pushed out and sent. Docket order 18502 recorded on the batch.');
  });
});
