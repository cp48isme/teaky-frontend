import { useState, type FormEvent } from 'react';
import { createPortalFromDescription, type StoreCreationResult } from '../../api/portals';
import Spinner from '../ui/Spinner';
import ScanProgress from '../ui/ScanProgress';

interface Props {
  onSuccess: (result: StoreCreationResult) => void;
  onBuildManually: () => void;
}

export default function DescribePortalStep({ onSuccess, onBuildManually }: Props) {
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setCreating(true);
    setError('');

    try {
      const result = await createPortalFromDescription(description);
      onSuccess(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create portal from description',
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Describe Your Portal</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your client and what they need. Our AI agents will analyze the
          description and create a portal with products and categories automatically.
        </p>
      </div>

      {/* Description textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Portal Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., 'Ace Hardware needs employee uniforms, banners, and vehicle wraps. They're in the retail tools   space and need customization options for colors and sizing.'"
          rows={5}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm font-mono text-xs"
        />
        <p className="mt-1 text-xs text-gray-500">
          Include details about: client name, products they need, their industry, website URL (if available), and any specific requirements.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Creating progress */}
      <ScanProgress isScanning={creating} />

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={creating || !description.trim()}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {creating ? (
            <>
              <Spinner className="h-4 w-4 text-white" />
              Creating Portal...
            </>
          ) : (
            'Create with AI'
          )}
        </button>

        <button
          type="button"
          onClick={onBuildManually}
          disabled={creating}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Or build manually
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        The AI may take 15-30 seconds to analyze and create your portal.
      </p>
    </form>
  );
}
