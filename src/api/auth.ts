import { apiRequest, clearSession, setSession } from './client';
import type { MeResponse, SessionResponse } from '../types/auth';
import { forgetSignedInDisplayName, forgetSignedInEmail, rememberSignedInEmail } from '../lib/portalSession';

export interface RegisterPayload {
  email: string;
  password: string;
  organization_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  /** The portal the buyer signed in from: the session is scoped to its organisation (S86). */
  portal_slug?: string;
}

export async function register(payload: RegisterPayload): Promise<void> {
  const tokens = await apiRequest<SessionResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setSession(tokens);
  rememberSignedInEmail(payload.email);
}

export async function login(payload: LoginPayload): Promise<void> {
  const tokens = await apiRequest<SessionResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setSession(tokens);
  rememberSignedInEmail(payload.email);
}

export async function logout(): Promise<void> {
  // The server revokes the cookie's refresh token and clears the cookie; the
  // access token is dropped here. No token is sent in the body.
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Best-effort logout
  }
  clearSession();
  forgetSignedInEmail();
  forgetSignedInDisplayName();
}

/** GET /auth/me (#272): who is signed in, for the account menu. 401 when not. */
export async function getMe(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me');
}

export interface PasswordResetRequestResponse {
  detail: string;
}

export interface PasswordResetConfirmResponse {
  detail: string;
  sessions_ended: number;
}

/** Ask for a reset link. The answer is the same sentence whether or not the
 *  address has an account; the portal only brands the email. */
export function requestPasswordReset(email: string, portalSlug?: string | null): Promise<PasswordResetRequestResponse> {
  return apiRequest<PasswordResetRequestResponse>('/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email, portal_slug: portalSlug || undefined }),
  });
}

/** Consume the single-use token and set the password. Every other session ends. */
export function confirmPasswordReset(token: string, newPassword: string): Promise<PasswordResetConfirmResponse> {
  return apiRequest<PasswordResetConfirmResponse>('/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export interface MyPortal {
  id: string;
  name: string;
  slug: string;
  status: string;
}

/** The portals the signed-in user is assigned to (belq, 30 Oct 2026): where sign-in lands. */
export async function listMyPortals(): Promise<MyPortal[]> {
  return apiRequest<MyPortal[]>('/auth/me/portals');
}

/** GET /auth/signup (t04, 18 Nov 2026): whether public self-signup is on. The
 * backend refuses POST /auth/register on its own when it is off; this only
 * decides whether the links are shown. */
export async function getSignupAvailability(): Promise<{ public_signup_enabled: boolean }> {
  return apiRequest<{ public_signup_enabled: boolean }>('/auth/signup');
}

/** The account surface (t01, 18 Nov 2026). */
export interface SessionSummary {
  id: string;
  created_at: string;
  expires_at: string;
  /** The session this browser's request came from (ruling 18 Nov 2026 evening). */
  current: boolean;
}

export interface PasswordChangedResponse extends SessionResponse {
  other_sessions_ended: number;
  credentials_changed_at: string;
}

export async function listSessions(): Promise<SessionSummary[]> {
  return apiRequest<SessionSummary[]>('/auth/sessions');
}

/** Change the password with the current one in hand; every other session ends
 * at its next request; this browser keeps going on the fresh session returned
 * (its new refresh token in the cookie). */
export async function changePassword(currentPassword: string, newPassword: string): Promise<PasswordChangedResponse> {
  const changed = await apiRequest<PasswordChangedResponse>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
  setSession(changed);
  return changed;
}

/** Sign out everywhere: every refresh token revoked on the server, then this
 * browser's session dropped. */
export async function logoutAll(): Promise<void> {
  try {
    await apiRequest('/auth/logout-all', { method: 'POST' });
  } catch {
    // Best-effort; the session is dropped either way.
  }
  clearSession();
  forgetSignedInEmail();
  forgetSignedInDisplayName();
}
