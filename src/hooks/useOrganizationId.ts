import { useMemo } from 'react';

/**
 * Decode a JWT payload without verifying the signature.
 * Only used client-side to read claims like `org`.
 */
function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  const payload = parts[1]!;
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}

/**
 * Extract the organization ID from the JWT stored in localStorage.
 * Returns null if no token or the claim is missing.
 */
export function useOrganizationId(): string | null {
  return useMemo(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payload = decodeJwtPayload(token);
      return (payload.org as string) ?? null;
    } catch {
      return null;
    }
  }, []);
}
