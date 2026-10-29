import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AcceptInvitationPage from '../AcceptInvitationPage';

// S86, the proper invited-buyer path: a visitor without an account sets a
// password and lands on the invited portal; nobody is sent to the printer
// registration form or the printer dashboard.

let authed = false;
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../api/client', () => ({ isAuthenticated: () => authed, switchOrganization: vi.fn().mockResolvedValue(true) }));
vi.mock('../../api/team', () => ({
  getInvitationPreview: vi.fn(),
  registerFromInvitation: vi.fn().mockResolvedValue(undefined),
  acceptInvitation: vi.fn().mockResolvedValue({ organization_id: 'org-rgi' }),
}));
vi.mock('../../lib/portalSession', () => ({ rememberPortal: vi.fn(), rememberSignedInEmail: vi.fn() }));
import { getInvitationPreview, registerFromInvitation, acceptInvitation } from '../../api/team';
import { switchOrganization } from '../../api/client';

const preview = {
  invited_email: 'frontdesk@example.com',
  organization_name: 'RGI Publications',
  role: 'end_user',
  portal_slug: 'raphael',
  portal_name: 'The Raphael Hotel',
  state: 'valid' as const,
  account_exists: false,
};

// The token travels in the fragment (nt7z); the path form is the pre-29-Oct link.
function renderPage(entry = '/invite#token=tok-123') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/invite" element={<AcceptInvitationPage />} />
        <Route path="/invite/:token" element={<AcceptInvitationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AcceptInvitationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getInvitationPreview).mockResolvedValue(preview);
  });

  it('lets a new buyer set a password and lands them on the invited portal', async () => {
    authed = false;
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText("You're invited to The Raphael Hotel")).toBeInTheDocument();
    expect(screen.queryByText(/Create Account/)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Password'), 'Walkthrough-2026!x');
    await user.click(screen.getByRole('button', { name: 'Set password and go to The Raphael Hotel' }));
    await waitFor(() => expect(registerFromInvitation).toHaveBeenCalledWith('tok-123', 'Walkthrough-2026!x', ''));
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael', { replace: true });
  });

  it('moves a signed-in visitor into the inviting organisation and lands on the portal', async () => {
    authed = true;
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));
    await waitFor(() => expect(acceptInvitation).toHaveBeenCalledWith('tok-123'));
    expect(switchOrganization).toHaveBeenCalledWith('org-rgi');
    expect(mockNavigate).toHaveBeenCalledWith('/p/raphael', { replace: true });
  });

  it('still reads a link sent before the fragment form, and rewrites its address', async () => {
    authed = false;
    const replaceState = vi.spyOn(window.history, 'replaceState');
    renderPage('/invite/tok-123');
    expect(await screen.findByText("You're invited to The Raphael Hotel")).toBeInTheDocument();
    expect(getInvitationPreview).toHaveBeenCalledWith('tok-123');
    expect(replaceState).toHaveBeenCalledWith(null, '', '/invite#token=tok-123');
    replaceState.mockRestore();
  });

  it('parks the token for the sign-in round trip instead of putting it in ?next=', async () => {
    authed = false;
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, account_exists: true });
    renderPage();
    expect(await screen.findByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=%2Finvite');
    expect(sessionStorage.getItem('teaky.pendingInvitationToken')).toBe('tok-123');
  });

  it('tells a used invitation to sign in instead', async () => {
    authed = false;
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, state: 'accepted' });
    renderPage();
    expect(await screen.findByText('This invitation has already been used.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=%2Fp%2Fraphael');
  });
});
