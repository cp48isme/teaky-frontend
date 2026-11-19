import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import BatchesPage from '../BatchesPage';
import { ApiError } from '../../../api/client';

/** Walk of 19 Nov 2026: a member without the floor role on this shop (a
 * sales_team_lead, say) gets the empty state and one line — not the API's
 * error string. */

vi.mock('../../../api/production', () => ({
  listBatches: vi.fn(() => Promise.reject(new ApiError(403, 'Insufficient permissions'))),
  markHalfBatch: vi.fn(),
  getProductionSettings: vi.fn(() => Promise.reject(new ApiError(403, 'Insufficient permissions'))),
}));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.reject(new ApiError(403, 'Insufficient permissions'))), proposeAction: vi.fn(), approveProposal: vi.fn(), declineProposal: vi.fn() }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'Teaky Sandbox (not a customer)', mark: { url: 'x', alt: 'Teaky', source: 'teaky' } })) }));

describe('a member without the floor role', () => {
  it('sees the empty state and one line on Batches and on the proposals, never "Insufficient permissions"', async () => {
    render(
      <MemoryRouter>
        <BatchesPage readOnly={false} />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getAllByTestId('no-floor-role').length).toBe(2));
    expect(screen.getAllByTestId('no-floor-role')[0]).toHaveTextContent("You don't have the floor role on this shop.");
    expect(screen.queryByText('Insufficient permissions')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('No batches to show.')).toBeTruthy();
  });
});
