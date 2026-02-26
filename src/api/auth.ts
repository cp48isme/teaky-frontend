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
