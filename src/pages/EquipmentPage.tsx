import { useState, useEffect } from 'react';
import {
  searchEquipment,
  getOrgEquipment,
  addEquipmentToOrg,
  removeEquipmentFromOrg,
} from '../api/equipment';
import type { Equipment, OrganizationEquipment } from '../types/equipment';
import { useOrganizationId } from '../hooks/useOrganizationId';
import Spinner from '../components/ui/Spinner';

export default function EquipmentPage() {
  const orgId = useOrganizationId();
  const [orgEquipment, setOrgEquipment] = useState<OrganizationEquipment[]>([]);
  const [catalogMap, setCatalogMap] = useState<Record<string, Equipment>>({});
  const [searchResults, setSearchResults] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const loadData = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const eq = await getOrgEquipment(orgId);
      setOrgEquipment(eq);
      // Load full equipment details for owned items
      if (eq.length > 0) {
        const all = await searchEquipment({});
        const map: Record<string, Equipment> = {};
        for (const item of all) {
          map[item.id] = item;
        }
        setCatalogMap(map);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orgId]);

  const handleSearch = async () => {
    try {
      const results = await searchEquipment({ query: search || undefined });
      setSearchResults(results);
      // Update catalog map with new results
      setCatalogMap((prev) => {
        const next = { ...prev };
        for (const item of results) {
          next[item.id] = item;
        }
        return next;
      });
      setShowCatalog(true);
    } catch {
      // ignore
    }
  };

  const handleAdd = async (equipmentId: string) => {
    if (!orgId) return;
    setAdding(equipmentId);
    try {
      await addEquipmentToOrg(orgId, { equipment_id: equipmentId, quantity: 1 });
      await loadData();
    } catch {
      // ignore
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (equipmentId: string) => {
    if (!orgId) return;
    try {
      await removeEquipmentFromOrg(orgId, equipmentId);
      await loadData();
    } catch {
      // ignore
    }
  };

  const ownedIds = new Set(orgEquipment.map((e) => e.equipment_id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold text-brand-dark lg:text-4xl">Equipment</h1>
        <p className="mt-2 text-base text-gray-600">
          Manage your shop's equipment. This helps our AI agents make better
          production recommendations.
        </p>
      </div>

      {/* Current equipment */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Your Equipment ({orgEquipment.length})
          </h2>
        </div>
        {orgEquipment.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {orgEquipment.map((eq) => {
              const detail = catalogMap[eq.equipment_id];
              return (
                <li
                  key={eq.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {detail?.name ?? eq.equipment_id}
                    </p>
                    {detail && (
                      <p className="text-xs text-gray-500">
                        {[detail.manufacturer, detail.equipment_type, detail.model_number]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                    {eq.notes && (
                      <p className="text-xs text-gray-400">{eq.notes}</p>
                    )}
                    <p className="text-xs text-gray-400">Qty: {eq.quantity}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(eq.equipment_id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            No equipment added yet. Search the catalog below to add your first
            piece of equipment.
          </div>
        )}
      </div>

      {/* Add from catalog */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">
          Add from Catalog
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Search for equipment by name, manufacturer, or type.
        </p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleSearch())
            }
            placeholder="e.g. Kornit, Epson, Roland..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-teak-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teak"
          >
            Search
          </button>
        </div>

        {showCatalog && (
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {searchResults.map((eq) => (
                  <li
                    key={eq.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {eq.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {[eq.manufacturer, eq.equipment_type, eq.model_number]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    {ownedIds.has(eq.id) ? (
                      <span className="text-xs font-medium text-green-600">
                        Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(eq.id)}
                        disabled={adding === eq.id}
                        className="rounded-md bg-teak/10 px-3 py-1.5 text-sm font-medium text-teak-dark hover:bg-teak/15 disabled:opacity-50"
                      >
                        {adding === eq.id ? 'Adding...' : 'Add'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">
                No equipment found. Try a different search term.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
