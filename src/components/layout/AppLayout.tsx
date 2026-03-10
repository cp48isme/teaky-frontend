import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBell from './NotificationBell';
import Sidebar from './Sidebar';

function getUserEmail(): string {
  const token = localStorage.getItem('access_token');
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.email || '';
  } catch {
    return '';
  }
}

function getInitials(email: string): string {
  if (!email) return '?';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, refresh } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const email = getUserEmail();
  const initials = getInitials(email);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex h-screen flex-col">
      {/* Brand gradient stripe */}
      <div className="h-0.5 bg-gradient-to-r from-teak-dark via-teak to-teak-light" />

      {/* Top nav */}
      <header className="flex h-14 shrink-0 items-center justify-between bg-white px-4 shadow-sm sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img src="/teaky-logo.svg" alt="Teaky" className="h-8 w-8" />
          <span className="font-heading text-lg font-bold text-brand-dark">teaky</span>
        </Link>

        <div className="flex items-center gap-3">
          <NotificationBell unreadCount={unreadCount} onCountChange={refresh} />

          {/* User avatar dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-teak-dark text-xs font-semibold text-white transition hover:bg-teak"
              title={email}
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-2">
                  <p className="truncate text-sm font-medium text-brand-dark">{email}</p>
                </div>
                <Link
                  to="/settings/team"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-brand-light p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
