import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listPortals } from '../api/portals';
import type { Portal } from '../types/portal';
import Spinner from '../components/ui/Spinner';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  paused: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
};

export default function PortalsListPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPortals()
      .then(setPortals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Portals</h2>
        <Link
          to="/portals/create"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Create Portal
        </Link>
      </div>

      {portals.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No portals yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first client portal to get started.
          </p>
          <Link
            to="/portals/create"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create Portal
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => (
            <Link
              key={portal.id}
              to={`/portals/${portal.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-900">{portal.name}</h3>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[portal.status] ?? 'bg-gray-100 text-gray-800'}`}
                >
                  {portal.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 font-mono">{portal.slug}.teaky.com</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>{portal.type}</span>
                <span>&middot;</span>
                <span>Created {new Date(portal.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
