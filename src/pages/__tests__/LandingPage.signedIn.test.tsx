import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from '../LandingPage';

// belq (ruling 30 Oct 2026): the landing page must never render a sign-in form
// to someone already signed in; they are sent on to their own place.

const postLoginRedirect = vi.fn().mockResolvedValue(undefined);
vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => postLoginRedirect }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ login: vi.fn() }) }));
vi.mock('../../api/client', async () => ({
  ...(await vi.importActual<typeof import('../../api/client')>('../../api/client')),
  isAuthenticated: () => true,
}));

describe('LandingPage — signed in', () => {
  it('renders no sign-in form and sends the user on', async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
    await waitFor(() => expect(postLoginRedirect).toHaveBeenCalledTimes(1));
  });
});
