import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { bootstrapSession, isAuthenticated } from '../api/client';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import type { LoginPayload, RegisterPayload } from '../api/auth';

interface AuthContextType {
  authenticated: boolean;
  /** False until the one silent refresh on load has answered (cookie cut-over):
   * the guarded routes wait for it before sending anyone to sign in. */
  ready: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  /** The tokens were stored by another path (a registration from an
   * invitation): tell the guarded routes so, instead of sending the new
   * user through /login (walk of 18 Nov 2026). */
  markSignedIn: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [ready, setReady] = useState(false);

  // On load: one silent refresh, the cookie deciding. A browser holding only
  // the old storage tokens has no cookie: its refresh fails and it signs in once.
  useEffect(() => {
    let cancelled = false;
    bootstrapSession().then((signedIn) => {
      if (cancelled) return;
      setAuthenticated(signedIn);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await apiLogin(payload);
    setAuthenticated(true);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiRegister(payload);
    setAuthenticated(true);
  }, []);

  const markSignedIn = useCallback(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, ready, login, register, markSignedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** The context when a provider is above, else null — for a component that
 * both shells render and that the production page tests mount bare. */
export function useOptionalAuth(): AuthContextType | null {
  return useContext(AuthContext);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
