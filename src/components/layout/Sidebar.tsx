import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', enabled: true },
  { to: '#', label: 'Portals', enabled: false },
  { to: '#', label: 'Orders', enabled: false },
  { to: '#', label: 'Equipment', enabled: false },
  { to: '#', label: 'Settings', enabled: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) =>
          item.enabled ? (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
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
