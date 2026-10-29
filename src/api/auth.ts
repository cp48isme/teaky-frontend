import { apiRequest, setTokens, clearTokens } from './client';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

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
  const tokens = await apiRequest<TokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setTokens(tokens);
}

export async function login(payload: LoginPayload): Promise<void> {
  const tokens = await apiRequest<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setTokens(tokens);
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      // Best-effort logout
    }
  }
  clearTokens();
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
