import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatchesPage from '../BatchesPage';
import AllChannelOrdersPage from '../AllChannelOrdersPage';
import ProductionLayout from '../../../components/production/ProductionLayout';
import Sidebar from '../../../components/layout/Sidebar';
import NotFoundPage from '../../NotFoundPage';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import { clearSession, setSession } from '../../../api/client';
import type { BatchSummary, TaylorPoolLine } from '../../../types/production';

/** Walk findings t07/t09 (dispatch 20 Nov 2026, item 5): Production in the
 * admin sidebar for a floor role; a Dashboard link and the mark as the way
 * home in the production layout; Mark done beside Push out on the card; a
 * search that empties the list says so by name; unknown routes land on a
 * not-found page; the dashboard profile tile links to settings. */

function batch(over: Partial<BatchSummary>): BatchSummary {
  return {
    unit_id: 'u-143', batch_number: 143, stock: '16 C2S', channel: 'press_run', used: 9, capacity: 24, blanks: 15, full: false, orders: 2, lines: 2, channels: ['press_run'],
    oldest_line_ref: 'W621723', oldest_line_age_seconds: 7 * 86400, release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false,
    fill_candidates: [], fillable_slots: 0, line_item_ids: [], ...over,
  };
}

const markBatchDone = vi.fn(() => Promise.resolve({ applied: true, reason: 'finished by hand', units: [{ unit_id: 'u-143', batch_number: 143, steps_remaining: 0, steps_skipped: 2, marked_done_at: '2026-11-20T18:00:00Z' }] }));
const listBatches = vi.fn(() => Promise.resolve([batch({})]));
vi.mock('../../../api/production', () => ({
  getProductionSettings: vi.fn(() => Promise.resolve({ production_view: 'cards' })),
  listBatches: () => listBatches(),
  listShopTags: vi.fn(() => Promise.resolve([])),
  markHalfBatch: vi.fn(),
  markBatchDone: (...args: unknown[]) => markBatchDone(...(args as [])),
  listTaylorPool: vi.fn(() => Promise.resolve([] as TaylorPoolLine[])),
  updateOrder: vi.fn(),
}));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])), proposeAction: vi.fn(), approveProposal: vi.fn(), declineProposal: vi.fn() }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(() => Promise.resolve(null)), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'Single Source US', mark: { url: 'https://app.example/logo.png', alt: 'Single Source US', source: 'shop_profile' } })) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));

function tokenWithRoles(roles: string[]): string {
  const b64 = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ roles }))}.sig`;
}

beforeEach(() => {
  localStorage.clear();
  resetProductionShell();
  markBatchDone.mockClear();
  listBatches.mockClear();
});

describe('Mark done on the card', () => {
  it('sits in the actions beside Push out, asks for a reason, confirms by batch number, then re-reads the batches', async () => {
    render(
      <MemoryRouter>
        <BatchesPage />
      </MemoryRouter>,
    );
    const pushOut = await screen.findByRole('button', { name: /^Push out with 15 blanks/ });
    const actions = pushOut.parentElement!;
    const markDone = within(actions).getByTestId('mark-done');
    expect(markDone).toHaveTextContent('Mark done…');
    await userEvent.click(markDone);
    const dialog = screen.getByRole('dialog', { name: 'Mark Batch 143 done' });
    const next = within(dialog).getByTestId('mark-done-next');
    expect(next).toBeDisabled();
    await userEvent.type(within(dialog).getByLabelText('Reason'), 'finished by hand');
    expect(next).toBeEnabled();
    expect(markBatchDone).not.toHaveBeenCalled();
    await userEvent.click(next);
    expect(within(dialog).getByTestId('mark-done-note')).toHaveTextContent('Batch 143');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Yes, mark Batch 143 done' }));
    await waitFor(() => expect(markBatchDone).toHaveBeenCalledWith('u-143', 'finished by hand', true));
    expect(await screen.findByRole('status')).toHaveTextContent('Batch 143 marked done; 2 remaining steps skipped.');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(listBatches).toHaveBeenCalledTimes(2);
  });

  it('is not offered read-only, nor on a batch already marked done', async () => {
    const { unmount } = render(
      <MemoryRouter>
        <BatchesPage readOnly />
      </MemoryRouter>,
    );
    await screen.findByTestId('batch-card');
    expect(screen.queryByTestId('mark-done')).toBeNull();
    unmount();
    listBatches.mockResolvedValueOnce([batch({ marked_done_at: '2026-11-19T10:00:00Z' })]);
    render(
      <MemoryRouter>
        <BatchesPage />
      </MemoryRouter>,
    );
    await screen.findByText('No batches to show.');
    await userEvent.selectOptions(screen.getByDisplayValue('Open'), 'Done');
    await screen.findByTestId('batch-card');
    expect(screen.queryByTestId('mark-done')).toBeNull();
  });
});

describe('a search with no results', () => {
  it('Batches says "No results for" the words typed, in cards and in the list', async () => {
    render(
      <MemoryRouter>
        <BatchesPage />
      </MemoryRouter>,
    );
    await screen.findByRole('button', { name: /^Push out with 15 blanks/ });
    await userEvent.type(screen.getByTestId('production-search'), 'zzz-nothing');
    expect(screen.getByTestId('no-batches')).toHaveTextContent('No results for "zzz-nothing"');
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(await screen.findByTestId('no-batches')).toHaveTextContent('No results for "zzz-nothing"');
  });

  it('All Channel Orders says the same in its own table', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('no-rows')).toHaveTextContent('Nothing to show.');
    await userEvent.type(screen.getByTestId('production-search'), 'W999');
    expect(screen.getByTestId('no-rows')).toHaveTextContent('No results for "W999"');
  });
});

describe('the production layout', () => {
  it('has a Dashboard link at the top of its nav and the mark links to the dashboard', async () => {
    render(
      <MemoryRouter>
        <ProductionLayout readOnly={false}>
          <div>body</div>
        </ProductionLayout>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('shell-mark')).toBeInTheDocument());
    expect(screen.getByTestId('dashboard-link')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('shell-mark-link')).toHaveAttribute('href', '/dashboard');
  });

  it('read-only: no Dashboard link; the mark goes to Batches', async () => {
    render(
      <MemoryRouter>
        <ProductionLayout readOnly>
          <div>body</div>
        </ProductionLayout>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('shell-mark')).toBeInTheDocument());
    expect(screen.queryByTestId('dashboard-link')).toBeNull();
    expect(screen.getByTestId('shell-mark-link')).toHaveAttribute('href', '/production/batches');
  });
});

describe('the admin sidebar', () => {
  it('shows Production, after Dashboard, for a role with a floor grant and not otherwise', async () => {
    setSession({ access_token: tokenWithRoles(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    const { unmount } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    const links = screen.getAllByRole('link').map((a) => a.textContent?.trim());
    expect(links[0]).toBe('Dashboard');
    expect(links[1]).toBe('Production');
    expect(screen.getByRole('link', { name: 'Production' })).toHaveAttribute('href', '/production/batches');
    unmount();
    clearSession();
    setSession({ access_token: tokenWithRoles(['buyer']), token_type: 'bearer', expires_in: 900 });
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link', { name: 'Production' })).toBeNull();
  });
});

describe('an unknown route', () => {
  it('lands on the not-found page with a way back', () => {
    render(
      <MemoryRouter initialEntries={['/no/such/page']}>
        <Routes>
          <Route path="/dashboard" element={<div>dash</div>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('not-found')).toHaveTextContent('Nothing at this address');
    expect(screen.getByRole('link', { name: /Take me back/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Report a problem/ })).toHaveAttribute('href', '/report-a-bug');
  });
});
