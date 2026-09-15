import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPortal } from '../api/portals';
import {
  listCategoryMargins,
  listProducts,
  repriceProducts,
} from '../api/products';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import { formatMoney, formatPercent } from '../lib/money';
import type { Portal } from '../types/portal';
import type {
  CategoryMargin,
  RepriceLine,
  RepriceResult,
} from '../types/product';

const ALL_CATEGORIES = '';

const SKIP_LABEL: Record<NonNullable<RepriceLine['skipped']>, string> = {
  no_base_cost: 'No cost on file',
  price_locked: 'Price set by hand (locked)',
};

/**
 * Bulk reprice: every matching product gets base_price = base_cost + margin%.
 *
 * Human-in-the-loop by construction. The form always runs a dry run first and
 * shows every old and new price; nothing is written until the operator
 * confirms the preview.
 */
export default function ProductRepricePage() {
  const { portalId } = useParams<{ portalId: string }>();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [defaults, setDefaults] = useState<CategoryMargin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [margin, setMargin] = useState<string>('');
  const [includeLocked, setIncludeLocked] = useState(false);

  const [preview, setPreview] = useState<RepriceResult | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState<RepriceResult | null>(null);

  useEffect(() => {
    if (!portalId) return;
    let cancelled = false;
    (async () => {
      try {
        const [p, products, margins] = await Promise.all([
          getPortal(portalId),
          listProducts(portalId),
          listCategoryMargins(portalId),
        ]);
        if (cancelled) return;
        setPortal(p);
        setCategories(Array.from(new Set(products.map((x) => x.category))).sort());
        setDefaults(margins);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [portalId]);

  // When a category is chosen and no margin has been typed, prefill the
  // seed-derived default for it.
  useEffect(() => {
    if (margin !== '') return;
    const match = defaults.find((d) => d.category === category);
    if (match) setMargin(match.default_margin_percent);
  }, [category, defaults, margin]);

  const defaultFor = (cat: string) =>
    defaults.find((d) => d.category === cat)?.default_margin_percent;

  const runPreview = async (e: FormEvent) => {
    e.preventDefault();
    if (!portalId) return;
    setError(null);
    setApplied(null);
    setPreviewing(true);
    try {
      const result = await repriceProducts(portalId, {
        margin_percent: margin,
        category: category === ALL_CATEGORIES ? null : category,
        include_locked: includeLocked,
        dry_run: true,
      });
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setPreviewing(false);
    }
  };

  const applyPreview = async () => {
    if (!portalId || !preview) return;
    setError(null);
    setApplying(true);
    try {
      const result = await repriceProducts(portalId, {
        margin_percent: preview.margin_percent,
        category: preview.category,
        include_locked: includeLocked,
        dry_run: false,
      });
      setApplied(result);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reprice failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }
  if (!portalId || !portal) {
    return <ErrorMessage message={error ?? 'Portal not found'} />;
  }

  const marginNumber = Number(margin);
  const marginValid = margin !== '' && !Number.isNaN(marginNumber) && marginNumber >= 0;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Portals', to: '/portals' },
          { label: portal.name, to: `/portals/${portalId}` },
          { label: 'Products', to: `/portals/${portalId}/products` },
          { label: 'Bulk reprice' },
        ]}
      />

      <div>
        <h2 className="font-heading text-xl font-bold text-brand-dark">Bulk reprice</h2>
        <p className="mt-1 text-sm text-gray-600">
          Sets each product&apos;s price to its cost plus a margin. Preview first; nothing
          changes until you apply. Prices set by hand are skipped unless you include them.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={runPreview} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Category</span>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setMargin('');
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none focus:ring-teak"
            >
              <option value={ALL_CATEGORIES}>All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                  {defaultFor(c) ? ` (default ${formatPercent(defaultFor(c))})` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Margin over cost (%)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="e.g. 200"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none focus:ring-teak"
              aria-label="Margin over cost (%)"
            />
            <span className="mt-1 block text-xs text-gray-500">
              Price = cost × (1 + margin). Category defaults come from the master catalog.
            </span>
          </label>

          <label className="flex items-center gap-2 self-end text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeLocked}
              onChange={(e) => setIncludeLocked(e.target.checked)}
              className="rounded border-gray-300 text-teak focus:ring-teak"
            />
            Also overwrite prices set by hand
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!marginValid || previewing}
            className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {previewing ? 'Previewing…' : 'Preview changes'}
          </button>
          <Link
            to={`/portals/${portalId}/products`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to products
          </Link>
        </div>
      </form>

      {applied && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          Repriced {applied.repriced} of {applied.matched} product(s) at{' '}
          {formatPercent(applied.margin_percent)} over cost
          {applied.category ? ` in ${applied.category}` : ''}. {applied.skipped} skipped.
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Preview:</span> {preview.repriced} of {preview.matched}{' '}
              product(s) would change at {formatPercent(preview.margin_percent)} over cost
              {preview.category ? ` in ${preview.category}` : ''}; {preview.skipped} skipped.
              Nothing has been written.
            </p>
            <button
              type="button"
              onClick={applyPreview}
              disabled={applying || preview.repriced === 0}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {applying ? 'Applying…' : `Apply to ${preview.repriced} product(s)`}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Cost</th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">Current</th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">New</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.lines.map((line) => (
                  <tr key={line.product_id} className={line.skipped ? 'text-gray-400' : ''}>
                    <td className="px-4 py-2 text-sm">
                      {line.name}
                      {line.sku && <span className="ml-2 text-xs text-gray-400">{line.sku}</span>}
                    </td>
                    <td className="px-4 py-2 text-sm">{line.category}</td>
                    <td className="px-4 py-2 text-right text-sm">{formatMoney(line.base_cost)}</td>
                    <td className="px-4 py-2 text-right text-sm">{formatMoney(line.old_price)}</td>
                    <td className="px-4 py-2 text-right text-sm font-medium">
                      {line.skipped ? '—' : formatMoney(line.new_price)}
                    </td>
                    <td className="px-4 py-2 text-sm">{line.skipped ? SKIP_LABEL[line.skipped] : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
