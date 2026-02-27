import { useState, useEffect } from 'react';
import { listCapabilities, replaceOrgCapabilities } from '../../api/capabilities';
import type { Capability } from '../../types/capability';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import Spinner from '../ui/Spinner';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CapabilitiesStep({ onNext, onBack }: Props) {
  const orgId = useOrganizationId();
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCapabilities()
      .then((caps) => {
        setCapabilities(caps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = async () => {
    if (!orgId || selected.size === 0) {
      onNext();
      return;
    }
    setSaving(true);
    try {
      await replaceOrgCapabilities(orgId, Array.from(selected));
    } catch {
      // Best-effort — continue even if save fails
    } finally {
      setSaving(false);
      onNext();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-6 w-6 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Capabilities</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select the services you offer. This helps match you with the right
          opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {capabilities.map((cap) => (
          <label
            key={cap.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              selected.has(cap.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(cap.id)}
              onChange={() => toggle(cap.id)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {cap.name}
              </span>
              {cap.description && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {cap.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving && <Spinner className="h-4 w-4 text-white" />}
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
