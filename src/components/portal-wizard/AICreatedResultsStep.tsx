import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StoreCreationResult } from '../../api/portals';

interface Props {
  result: StoreCreationResult;
}

export default function AICreatedResultsStep({ result }: Props) {
  const navigate = useNavigate();

  const handleViewPortal = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/portals/${result.portal_id}`);
  };

  const handlePublish = (e: FormEvent) => {
    e.preventDefault();
    // Redirect to portal detail page where user can publish
    navigate(`/portals/${result.portal_id}`);
  };

  return (
    <form onSubmit={handleViewPortal} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Portal Created!</h2>
        <p className="mt-1 text-sm text-gray-500">
          Our AI agents have created your portal. Review the summary below.
        </p>
      </div>

      {/* Success banner */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-900">✓ Portal successfully created</p>
      </div>

      {/* Portal details grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Portal name */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Portal Name
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-900">{result.portal_name}</p>
        </div>

        {/* Portal URL */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Portal URL
          </label>
          <a
            href={result.portal_url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-lg font-semibold text-teak hover:underline"
          >
            {result.portal_url}
          </a>
        </div>

        {/* Products created */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Products Created
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {result.products_created}
          </p>
        </div>

        {/* Categories created */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Categories
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {result.categories_created.length}
          </p>
        </div>
      </div>

      {/* Categories list */}
      {result.categories_created.length > 0 && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Categories Created
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.categories_created.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Agent summary */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Agent Summary
        </label>
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-700">{result.agent_summary}</p>
        </div>
      </div>

      {/* Warnings (if any) */}
      {result.warnings.length > 0 && (
        <div>
          <label className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            Warnings
          </label>
          <ul className="mt-2 space-y-1">
            {result.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-amber-700">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Capability gaps (if any) */}
      {result.capability_gaps.length > 0 && (
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Potential Gaps
          </label>
          <p className="mt-1 text-sm text-gray-600">
            The agents identified these potential capability gaps:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {result.capability_gaps.map((gap, i) => (
              <li key={i} className="text-sm text-gray-700">
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePublish}
          className="flex-1 rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak"
        >
          View & Manage Portal
        </button>
        <button
          type="submit"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          All Done
        </button>
      </div>
    </form>
  );
}
