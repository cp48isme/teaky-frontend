import { useState, useEffect, useCallback } from 'react';
import { searchAuditTrail, getExportUrl } from '../../api/audit';
import type { AuditLogEntry, AuditLogPage, AuditSearchParams } from '../../types/audit';
import Spinner from '../../components/ui/Spinner';

export default function AuditTrailPage() {
  const [data, setData] = useState<AuditLogPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditSearchParams>({
    page: 1,
    page_size: 25,
  });

  // Filter form state
  const [actionFilter, setActionFilter] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchAuditTrail(filters);
      setData(result);
    } catch {
      // Error handled by apiRequest
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function applyFilters() {
    setFilters({
      action: actionFilter || undefined,
      resource_type: resourceTypeFilter || undefined,
      start_date: startDate ? new Date(startDate).toISOString() : undefined,
      end_date: endDate ? new Date(endDate).toISOString() : undefined,
      page: 1,
      page_size: 25,
    });
  }

  function clearFilters() {
    setActionFilter('');
    setResourceTypeFilter('');
    setStartDate('');
    setEndDate('');
    setFilters({ page: 1, page_size: 25 });
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
        <div className="flex gap-2">
          <a
            href={getExportUrl('csv', filters)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export CSV
          </a>
          <a
            href={getExportUrl('json', filters)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export JSON
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-gray-600">Action</label>
            <input
              type="text"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              placeholder="e.g. user.registered"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:ring-teak"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Resource Type</label>
            <input
              type="text"
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
              placeholder="e.g. order"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:ring-teak"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:ring-teak"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:ring-teak"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={applyFilters}
            className="rounded-md bg-teak-dark px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-teak"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-6 w-6 text-teak-dark" />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.items.map((entry: AuditLogEntry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {entry.resource_type && (
                        <span>
                          {entry.resource_type}
                          {entry.resource_id && (
                            <span className="ml-1 text-gray-400">#{entry.resource_id.slice(0, 8)}</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-mono text-gray-500">
                      {entry.user_id ? entry.user_id.slice(0, 8) + '...' : '-'}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">
                      {entry.details ? JSON.stringify(entry.details) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(data.page - 1) * data.page_size + 1}–
              {Math.min(data.page * data.page_size, data.total)} of {data.total} entries
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => goToPage(data.page - 1)}
                disabled={data.page <= 1}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, data.page - 2);
                const pageNum = start + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`rounded-md border px-3 py-1 text-sm ${
                      pageNum === data.page
                        ? 'border-teak-dark bg-teak-dark text-white'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(data.page + 1)}
                disabled={data.page >= totalPages}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-sm text-gray-500">
          No audit trail entries found matching your filters.
        </div>
      )}
    </div>
  );
}
