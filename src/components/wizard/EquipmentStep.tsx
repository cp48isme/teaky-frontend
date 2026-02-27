import { useState, useEffect, useCallback } from 'react';
import { searchEquipment, addEquipmentToOrg, removeEquipmentFromOrg, getOrgEquipment } from '../../api/equipment';
import type { Equipment, OrganizationEquipment } from '../../types/equipment';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import Spinner from '../ui/Spinner';

const EQUIPMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'dtg', label: 'DTG' },
  { value: 'screen_print', label: 'Screen Print' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'wide_format', label: 'Wide Format' },
  { value: 'heat_press', label: 'Heat Press' },
  { value: 'sublimation', label: 'Sublimation' },
  { value: 'pad_print', label: 'Pad Print' },
  { value: 'vinyl_cut', label: 'Vinyl Cut' },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function EquipmentStep({ onNext, onBack }: Props) {
  const orgId = useOrganizationId();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [results, setResults] = useState<Equipment[]>([]);
  const [orgEquipment, setOrgEquipment] = useState<OrganizationEquipment[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Load existing org equipment on mount
  useEffect(() => {
    if (!orgId) return;
    getOrgEquipment(orgId)
      .then(setOrgEquipment)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orgId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim() && !typeFilter) {
        setResults([]);
        return;
      }
      setSearching(true);
      try {
        const data = await searchEquipment({
          query: query.trim() || undefined,
          equipment_type: typeFilter || undefined,
        });
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, typeFilter]);

  const addedIds = new Set(orgEquipment.map((oe) => oe.equipment_id));

  const handleAdd = useCallback(
    async (equipmentId: string) => {
      if (!orgId) return;
      setAddingId(equipmentId);
      try {
        const added = await addEquipmentToOrg(orgId, {
          equipment_id: equipmentId,
        });
        setOrgEquipment((prev) => [...prev, added]);
      } catch {
        // Might already be added
      } finally {
        setAddingId(null);
      }
    },
    [orgId],
  );

  const handleRemove = useCallback(
    async (equipmentId: string) => {
      if (!orgId) return;
      try {
        await removeEquipmentFromOrg(orgId, equipmentId);
        setOrgEquipment((prev) =>
          prev.filter((oe) => oe.equipment_id !== equipmentId),
        );
      } catch {
        // ignore
      }
    },
    [orgId],
  );

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
        <h2 className="text-lg font-semibold text-gray-900">
          Equipment Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select the equipment you own. This helps us understand your production
          capabilities.
        </p>
      </div>

      {/* Your Equipment */}
      {orgEquipment.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Your Equipment ({orgEquipment.length})
          </h3>
          <div className="space-y-2">
            {orgEquipment.map((oe) => {
              const eq = results.find((r) => r.id === oe.equipment_id);
              return (
                <div
                  key={oe.id}
                  className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">&#10003;</span>
                    <span className="text-sm font-medium text-gray-900">
                      {eq?.name ?? `Equipment ${oe.equipment_id.slice(0, 8)}...`}
                    </span>
                    {eq && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {eq.equipment_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(oe.equipment_id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search equipment (e.g., Epson, Brother GTX)..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {searching && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner className="h-4 w-4" /> Searching...
          </div>
        )}

        {!searching && results.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-1 rounded-md border border-gray-200">
            {results
              .filter((r) => !addedIds.has(r.id))
              .map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {eq.name}
                    </span>
                    {eq.manufacturer && (
                      <span className="ml-2 text-sm text-gray-500">
                        {eq.manufacturer}
                      </span>
                    )}
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {eq.equipment_type.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(eq.id)}
                    disabled={addingId === eq.id}
                    className="rounded bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                  >
                    {addingId === eq.id ? '...' : '+ Add'}
                  </button>
                </div>
              ))}
          </div>
        )}

        {!searching && query.trim() && results.length === 0 && (
          <p className="text-sm text-gray-500">
            No equipment found for "{query}".
          </p>
        )}
      </div>

      {/* Navigation */}
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
            onClick={onNext}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
