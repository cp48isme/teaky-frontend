import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { listPortalQuotes, updatePortalQuote, createPortalQuote } from '../../api/quotes';
import type { QuoteRequestPage } from '../../types/quote';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  converted: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function MyQuotesPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<QuoteRequestPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New quote form
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchQuotes = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const result = await listPortalQuotes(slug);
      setData(result);
    } catch {
      // handled by apiRequest
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setSaving(true);
    try {
      await createPortalQuote(slug, {
        description,
        quantity: parseInt(quantity, 10),
        desired_date: desiredDate || undefined,
        notes: notes || undefined,
      });
      setShowForm(false);
      setDescription('');
      setQuantity('');
      setDesiredDate('');
      setNotes('');
      await fetchQuotes();
    } catch {
      // handled by apiRequest
    } finally {
      setSaving(false);
    }
  }

  async function handleAcceptDecline(quoteId: string, action: 'accepted' | 'declined') {
    if (!slug) return;
    try {
      await updatePortalQuote(slug, quoteId, { status: action });
      await fetchQuotes();
    } catch {
      // handled by apiRequest
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Quotes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teak"
        >
          Request a Quote
        </button>
      </div>

      {/* New Quote Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What do you need?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:ring-teak"
              placeholder="Describe what you're looking for..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:ring-teak"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Desired Date (optional)
              </label>
              <input
                type="date"
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:ring-teak"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:ring-teak"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teak disabled:opacity-50"
            >
              {saving ? 'Submitting...' : 'Submit Quote Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Quote List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-6 w-6 text-teak-dark" />
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-4">
          {data.items.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {quote.description}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>Qty: {quote.quantity}</span>
                    {quote.desired_date && (
                      <span>Desired: {quote.desired_date}</span>
                    )}
                    <span>
                      Submitted: {new Date(quote.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}`}
                >
                  {quote.status}
                </span>
              </div>

              {/* Show price and accept/decline for quoted items */}
              {quote.status === 'quoted' && quote.quoted_price != null && (
                <div className="mt-3 flex items-center justify-between rounded-md bg-blue-50 px-3 py-2">
                  <span className="text-sm font-medium text-blue-800">
                    Quoted Price: ${quote.quoted_price.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptDecline(quote.id, 'accepted')}
                      className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-500"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAcceptDecline(quote.id, 'declined')}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {quote.notes && (
                <p className="mt-2 text-xs text-gray-500">Notes: {quote.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-gray-500">
          No quote requests yet. Click "Request a Quote" to get started.
        </div>
      )}
    </div>
  );
}
