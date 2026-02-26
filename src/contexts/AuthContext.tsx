import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { isAuthenticated } from '../api/client';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import type { LoginPayload, RegisterPayload } from '../api/auth';

interface AuthContextType {
  authenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = useCallback(async (payload: LoginPayload) => {
    await apiLogin(payload);
    setAuthenticated(true);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await apiRegister(payload);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
