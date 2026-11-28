import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AccountMenu from './AccountMenu';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBell from './NotificationBell';
import SiteFooter from './SiteFooter';
import Sidebar from './Sidebar';
import LimiterDegradedBanner from './LimiterDegradedBanner';
import { useLoginLimiterStatus } from '../../hooks/useLoginLimiterStatus';
import { useFloorOffered } from '../../hooks/useFloorOffered';
import { PRODUCTION_LANDING } from '../../lib/roles';
import HelpLink from './HelpLink';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { unreadCount, refresh } = useNotifications();
  const limiterStatus = useLoginLimiterStatus();
  // Navigation (28 Nov 2026, kkqk 1a): one header link each way between the
  // shop side and the floor, shown by the same rule as the sidebar's Production.
  const floorOffered = useFloorOffered();

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
          {floorOffered ? (
            <Link to={PRODUCTION_LANDING} className="rounded-full border border-teak/30 px-3 py-1.5 text-sm font-medium text-teak-dark transition hover:bg-teak/5" data-testid="to-floor-link">
              Production floor →
            </Link>
          ) : null}
          <HelpLink />
          <NotificationBell unreadCount={unreadCount} onCountChange={refresh} />

          {/* The account menu both shells share */}
          <AccountMenu />
        </div>
      </header>

      <LimiterDegradedBanner status={limiterStatus} />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-y-auto bg-brand-light">
          <div className="flex-1 p-4 sm:p-6">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
