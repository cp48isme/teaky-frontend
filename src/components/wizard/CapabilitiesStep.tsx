import { useState, useEffect } from 'react';
import {
  listCapabilities,
  replaceOrgCapabilities,
  getCapabilitySuggestions,
} from '../../api/capabilities';
import type { Capability } from '../../types/capability';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import Spinner from '../ui/Spinner';

interface Props {
  equipmentIds: string[];
  onNext: () => void;
  onBack: () => void;
}

export default function CapabilitiesStep({
  equipmentIds,
  onNext,
  onBack,
}: Props) {
  const orgId = useOrganizationId();
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [suggestedIds, setSuggestedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [caps, suggestions] = await Promise.all([
          listCapabilities(),
          getCapabilitySuggestions(equipmentIds),
        ]);
        setCapabilities(caps);

        const suggIds = new Set(suggestions.map((s) => s.id));
        setSuggestedIds(suggIds);

        // Pre-select suggested capabilities
        setSelected(new Set(suggIds));
      } catch {
        // Best-effort
      } finally {
        setLoading(false);
      }
    })();
  }, [equipmentIds]);

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
        <Spinner className="h-6 w-6 text-teak-dark" />
      </div>
    );
  }

  const suggested = capabilities.filter((c) => suggestedIds.has(c.id));
  const other = capabilities.filter((c) => !suggestedIds.has(c.id));

  const renderCapability = (cap: Capability, isSuggested: boolean) => (
    <label
      key={cap.id}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
        selected.has(cap.id)
          ? isSuggested
            ? 'border-teak bg-teak/10'
            : 'border-teak bg-teak/10'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <input
        type="checkbox"
        checked={selected.has(cap.id)}
        onChange={() => toggle(cap.id)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teak-dark focus:ring-teak"
      />
      <div>
        <span className="text-sm font-medium text-gray-900">{cap.name}</span>
        {isSuggested && (
          <span className="ml-2 rounded bg-teak/15 px-1.5 py-0.5 text-xs font-medium text-teak-dark">
            Recommended
          </span>
        )}
        {cap.description && (
          <p className="mt-0.5 text-xs text-gray-500">{cap.description}</p>
        )}
      </div>
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Capabilities</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your capabilities help our AI agents match the right jobs to your shop
          and suggest products your clients will love.
        </p>
      </div>

      {/* Suggested capabilities section */}
      {suggested.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-teak-dark">
            Recommended based on your equipment
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {suggested.map((cap) => renderCapability(cap, true))}
          </div>
        </div>
      )}

      {/* Other capabilities section */}
      {other.length > 0 && (
        <div className="space-y-3">
          {suggested.length > 0 && (
            <h3 className="text-sm font-medium text-gray-700">
              Other capabilities
            </h3>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {other.map((cap) => renderCapability(cap, false))}
          </div>
        </div>
      )}

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
            className="inline-flex items-center gap-2 rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {saving && <Spinner className="h-4 w-4 text-white" />}
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
