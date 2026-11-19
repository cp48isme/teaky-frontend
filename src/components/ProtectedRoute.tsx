import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated, ready } = useAuth();

  // Until the silent refresh on load has answered, nobody is sent to sign in.
  if (!ready) {
    return null;
  }
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
