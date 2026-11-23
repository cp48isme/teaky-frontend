import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { canAdministerShop } from '../../lib/roles';

const SETTINGS_TABS = [
  { to: '/settings/company', label: 'Company' },
  { to: '/settings/team', label: 'Team' },
  // The admin surface (t03): printer_admin only — hidden from everyone else.
  { to: '/settings/admin', label: 'Admin', adminOnly: true },
  { to: '/settings/notifications', label: 'Notifications' },
  { to: '/settings/integrations', label: 'Integrations' },
  { to: '/settings/stripe', label: 'Stripe' },
  { to: '/settings/audit-trail', label: 'Audit Trail' },
];

export default function SettingsLayout() {
  const admin = canAdministerShop();
  const tabs = SETTINGS_TABS.filter((tab) => !('adminOnly' in tab) || admin);
  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Settings' },
      ]} />
      <h1 className="font-heading text-xl font-bold text-brand-dark">Settings</h1>

      <div className="mt-4 border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `border-b-2 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-teak-dark text-teak-dark'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
