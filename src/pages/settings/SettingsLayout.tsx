import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const SETTINGS_TABS = [
  { to: '/settings/team', label: 'Team' },
  { to: '/settings/notifications', label: 'Notifications' },
  { to: '/settings/integrations', label: 'Integrations' },
  { to: '/settings/stripe', label: 'Stripe' },
  { to: '/settings/audit-trail', label: 'Audit Trail' },
];

export default function SettingsLayout() {
  return (
    <div className="mx-auto max-w-5xl">
      <Breadcrumbs items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Settings' },
      ]} />
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <div className="mt-4 border-b border-gray-200">
        <nav className="flex gap-6">
          {SETTINGS_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `border-b-2 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
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
