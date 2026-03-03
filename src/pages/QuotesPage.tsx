import { useState, useEffect, useCallback } from 'react';
import { listPortals } from '../api/portals';
import { listQuotes, updateQuote } from '../api/quotes';
import type { Portal } from '../types/portal';
import type { QuoteRequest, QuoteRequestPage } from '../types/quote';
import Spinner from '../components/ui/Spinner';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'converted', label: 'Converted' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function QuotesPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [selectedPortalId, setSelectedPortalId] = useState('');
  const [data, setData] = useState<QuoteRequestPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Quote detail modal
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listPortals()
      .then((p) => {
        setPortals(p);
        if (p.length > 0) setSelectedPortalId(p[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchQuotes = useCallback(async () => {
    if (!selectedPortalId) return;
    setLoading(true);
    try {
      const result = await listQuotes(selectedPortalId, {
        status: statusFilter || undefined,
        page,
        page_size: 25,
      });
      setData(result);
    } catch {
      // handled by apiRequest
    } finally {
      setLoading(false);
    }
  }, [selectedPortalId, statusFilter, page]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  async function handleStatusUpdate(quoteId: string, newStatus: string) {
    if (!selectedPortalId) return;
    setSaving(true);
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'quoted' && quotePrice) {
        updateData.quoted_price = parseFloat(quotePrice);
      }
      if (quoteNotes) {
        updateData.notes = quoteNotes;
      }
      await updateQuote(selectedPortalId, quoteId, updateData);
      setSelectedQuote(null);
      setQuotePrice('');
      setQuoteNotes('');
      await fetchQuotes();
    } catch {
      // handled by apiRequest
    } finally {
      setSaving(false);
    }
  }

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Quote Requests</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={selectedPortalId}
          onChange={(e) => {
            setSelectedPortalId(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {portals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-6 w-6 text-indigo-600" />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Desired Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Quoted Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.items.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-900">
                      {quote.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {quote.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {quote.desired_date || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {quote.quoted_price != null
                        ? `$${quote.quoted_price.toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setQuotePrice(
                            quote.quoted_price != null
                              ? String(quote.quoted_price)
                              : '',
                          );
                          setQuoteNotes(quote.notes || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(data.page - 1) * data.page_size + 1}&ndash;
                {Math.min(data.page * data.page_size, data.total)} of {data.total}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-sm text-gray-500">
          No quote requests found.
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Quote Details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-500">Description:</span>
                <p className="mt-1 text-gray-900">{selectedQuote.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-500">Quantity:</span>
                  <p className="text-gray-900">{selectedQuote.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Desired Date:</span>
                  <p className="text-gray-900">{selectedQuote.desired_date || 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-500">Status:</span>
                <span
                  className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[selectedQuote.status] || 'bg-gray-100 text-gray-800'}`}
                >
                  {selectedQuote.status}
                </span>
              </div>

              {/* Quote Price Input (for pending quotes) */}
              {selectedQuote.status === 'pending' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Quote Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter price"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600">Notes</label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedQuote(null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Close
              </button>

              {selectedQuote.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(selectedQuote.id, 'quoted')}
                  disabled={saving || !quotePrice}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {saving ? 'Sending...' : 'Send Quote'}
                </button>
              )}

              {selectedQuote.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(selectedQuote.id, 'cancelled')}
                  disabled={saving}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
