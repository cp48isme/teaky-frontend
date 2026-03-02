import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', enabled: true },
  { to: '/portals', label: 'Portals', enabled: true },
  { to: '/orders', label: 'Orders', enabled: true },
  { to: '/quotes', label: 'Quotes', enabled: true },
  { to: '#', label: 'Equipment', enabled: false },
  { to: '/settings/team', label: 'Settings', enabled: true, matchPrefix: '/settings' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.label}
              to={item.to}
              className={() => {
                const active = item.matchPrefix
                  ? pathname.startsWith(item.matchPrefix)
                  : pathname === item.to || pathname.startsWith(item.to + '/');
                return `rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`;
              }}
            >
              {item.label}
            </NavLink>
          ) : (
            <span
              key={item.label}
              className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-gray-400"
              title="Coming soon"
            >
              {item.label}
            </span>
          ),
        )}
      </nav>
    </aside>
  );
}
