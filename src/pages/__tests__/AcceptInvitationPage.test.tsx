import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AcceptInvitationPage from '../AcceptInvitationPage';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

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
import { rememberPortal } from '../../lib/portalSession';

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
/** What ProtectedRoute reads: the context's flag, not the storage. */
function AuthProbe() {
  const { authenticated } = useAuth();
  return <span data-testid="auth-probe">{authenticated ? 'signed in' : 'signed out'}</span>;
}

function renderPage(entry = '/invite#token=tok-123') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[entry]}>
        <AuthProbe />
        <Routes>
          <Route path="/invite" element={<AcceptInvitationPage />} />
          <Route path="/invite/:token" element={<AcceptInvitationPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
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

  // Ruling 17 Nov 2026 (BLOCKS): the landing is the role's, not the portal's.
  it('lands a shadow_reader on the production screens, not the portal, and remembers no portal', async () => {
    authed = false;
    vi.mocked(getInvitationPreview).mockResolvedValue({
      ...preview,
      role: 'shadow_reader',
      organization_name: 'Teaky Sandbox (not a customer)',
      portal_slug: 'sandbox-hotel',
      portal_name: 'Sandbox Hotel (test portal)',
    });
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Password');
    await user.type(screen.getByLabelText('Password'), 'Walkthrough-2026!x');
    await user.click(screen.getByRole('button', { name: /Set password/ }));
    await waitFor(() => expect(registerFromInvitation).toHaveBeenCalledWith('tok-123', 'Walkthrough-2026!x', ''));
    expect(mockNavigate).toHaveBeenCalledWith('/production/batches', { replace: true });
    expect(mockNavigate).not.toHaveBeenCalledWith('/p/sandbox-hotel', { replace: true });
    expect(rememberPortal).not.toHaveBeenCalled();
  });

  it('a new user is signed in for the guarded landing the moment the registration answers — no hop through /login (walk of 18 Nov 2026)', async () => {
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, role: 'shadow_reader' });
    vi.mocked(registerFromInvitation).mockImplementation(async () => {
      authed = true; // the tokens are in storage now, as registerFromInvitation leaves them
    });
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByTestId('auth-probe')).toHaveTextContent('signed out');
    await user.type(await screen.findByLabelText('Password'), 'Walkthrough-2026!x');
    await user.click(screen.getByRole('button', { name: /^Set password/ }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/production/batches', { replace: true }));
    expect(screen.getByTestId('auth-probe')).toHaveTextContent('signed in');
    authed = false;
  });

  it('lands invited staff (printer_admin with a portal attached) on the production screens too', async () => {
    authed = true;
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, role: 'printer_admin' });
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));
    await waitFor(() => expect(acceptInvitation).toHaveBeenCalledWith('tok-123'));
    expect(mockNavigate).toHaveBeenCalledWith('/production/batches', { replace: true });
    expect(rememberPortal).not.toHaveBeenCalled();
  });

  it('still lands a buyer on the invited portal and remembers it', async () => {
    authed = true;
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, role: 'portal_admin' });
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole('button', { name: 'Accept invitation' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/p/raphael', { replace: true }));
    expect(rememberPortal).toHaveBeenCalledWith('raphael');
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

  it('an address that already has an account is offered the reset, not only the sign-in it may be locked out of', async () => {
    authed = false;
    vi.mocked(getInvitationPreview).mockResolvedValue({ ...preview, account_exists: true });
    renderPage();
    expect(await screen.findByText(/reset your password if you have forgotten it/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=%2Finvite');
    expect(screen.getByRole('link', { name: 'Reset your password' })).toHaveAttribute(
      'href',
      '/forgot-password?email=frontdesk%40example.com&next=%2Finvite',
    );
  });
});
