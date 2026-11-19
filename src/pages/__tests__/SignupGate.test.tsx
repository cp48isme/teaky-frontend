import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LandingPage from '../LandingPage';
import LoginPage from '../LoginPage';
import { resetSignupAvailability } from '../../hooks/useSignupAvailability';

/** The signup gate (t04, 18 Nov 2026): the root page and /login share one
 * sign-in form with the same "Forgot your password?" link; every "Create a
 * free account" / "Start Free Trial" offer is shown only when the server says
 * public sign-up is on, and never before it has said so. */

let enabled = false;
const getSignupAvailability = vi.fn(() => Promise.resolve({ public_signup_enabled: enabled }));
vi.mock('../../api/auth', () => ({ getSignupAvailability: () => getSignupAvailability() }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ login: vi.fn() }) }));
vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => vi.fn() }));
vi.mock('../../api/client', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../api/client')>()), isAuthenticated: () => false }));

function mount(path: string, page: 'landing' | 'login') {
  return render(
    <MemoryRouter initialEntries={[path]}>{page === 'landing' ? <LandingPage /> : <LoginPage />}</MemoryRouter>,
  );
}

const offers = () => [
  ...screen.queryAllByRole('link', { name: /Create a free account/ }),
  ...screen.queryAllByRole('button', { name: /Start Free|Get Started Free/ }),
];

beforeEach(() => {
  resetSignupAvailability();
  getSignupAvailability.mockClear();
});

describe('the signup gate', () => {
  it('off: the root page keeps its sign-in card and forgot-password link and offers no sign-up', async () => {
    enabled = false;
    mount('/', 'landing');
    await waitFor(() => expect(getSignupAvailability).toHaveBeenCalledTimes(1));
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getByTestId('sign-in-form')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Forgot your password?' })).toHaveAttribute('href', '/forgot-password');
    expect(offers()).toEqual([]);
  });

  it('off: /login has the same form and link and no offer', async () => {
    enabled = false;
    mount('/login', 'login');
    await waitFor(() => expect(getSignupAvailability).toHaveBeenCalledTimes(1));
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getByTestId('sign-in-form')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Forgot your password?' })).toHaveAttribute('href', '/forgot-password');
    expect(offers()).toEqual([]);
  });

  it('on: both pages show the offers, once the server has said so', async () => {
    enabled = true;
    mount('/', 'landing');
    await waitFor(() => expect(screen.getByRole('link', { name: 'Create a free account' })).toHaveAttribute('href', '/register'));
    expect(screen.getAllByRole('button', { name: /Start Free|Get Started Free/ }).length).toBeGreaterThanOrEqual(2);
    resetSignupAvailability();
    mount('/login', 'login');
    await waitFor(() => expect(screen.getAllByRole('link', { name: 'Create a free account' }).length).toBe(2));
  });

  it('the forgot link carries the typed email and the next on /login', async () => {
    enabled = false;
    mount('/login?next=%2Fproduction%2Fbatches', 'login');
    const { default: userEvent } = await import('@testing-library/user-event');
    await userEvent.type(screen.getByLabelText('Email'), 'me@shop.example');
    expect(screen.getByRole('link', { name: 'Forgot your password?' })).toHaveAttribute('href', '/forgot-password?email=me%40shop.example&next=%2Fproduction%2Fbatches');
  });
});
