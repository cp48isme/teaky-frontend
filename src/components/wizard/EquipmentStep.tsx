import { useState, useEffect, useCallback } from 'react';
import {
  searchEquipment,
  addEquipmentToOrg,
  removeEquipmentFromOrg,
  getOrgEquipment,
  createCustomEquipment,
  uploadOnboardingDocument,
} from '../../api/equipment';
import { getCapabilitySuggestions } from '../../api/capabilities';
import type { Equipment, OrganizationEquipment } from '../../types/equipment';
import type { Capability } from '../../types/capability';
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
  { value: 'digital_press', label: 'Digital Press' },
  { value: 'offset', label: 'Offset' },
  { value: 'cutting_finishing', label: 'Cutting / Finishing' },
  { value: 'laser_engraver', label: 'Laser Engraver' },
];

const ACCEPTED_FILE_TYPES =
  '.pdf,.docx,.xlsx,.png,.jpg,.jpeg';

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

  // Suggested capabilities
  const [suggestedCapabilities, setSuggestedCapabilities] = useState<Capability[]>([]);
  const [loadingCapabilities, setLoadingCapabilities] = useState(false);

  // Custom equipment form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customManufacturer, setCustomManufacturer] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customType, setCustomType] = useState('dtg');
  const [customSaving, setCustomSaving] = useState(false);
  const [customSuccess, setCustomSuccess] = useState('');

  // File upload
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Load existing org equipment on mount
  useEffect(() => {
    if (!orgId) return;
    getOrgEquipment(orgId)
      .then(setOrgEquipment)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orgId]);

  // Fetch suggested capabilities when equipment changes
  useEffect(() => {
    if (orgEquipment.length === 0) {
      setSuggestedCapabilities([]);
      setLoadingCapabilities(false);
      return;
    }

    let cancelled = false;
    setLoadingCapabilities(true);
    const equipmentIds = orgEquipment.map((oe) => oe.equipment_id);

    getCapabilitySuggestions(equipmentIds)
      .then((suggestions) => {
        if (!cancelled) {
          setSuggestedCapabilities(suggestions);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestedCapabilities([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCapabilities(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [orgEquipment]);

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

  const handleCustomSubmit = async () => {
    if (!customName.trim() || !orgId) return;
    setCustomSaving(true);
    setCustomSuccess('');
    try {
      const equipment = await createCustomEquipment({
        name: customName.trim(),
        manufacturer: customManufacturer.trim() || undefined,
        model_number: customModel.trim() || undefined,
        equipment_type: customType,
      });
      // Auto-add to org
      const added = await addEquipmentToOrg(orgId, {
        equipment_id: equipment.id,
      });
      setOrgEquipment((prev) => [...prev, added]);
      setCustomSuccess(
        'Added! Our AI agents will research this equipment and enrich your profile with its specifications.',
      );
      setCustomName('');
      setCustomManufacturer('');
      setCustomModel('');
    } catch {
      setCustomSuccess('Could not add equipment. Please try again.');
    } finally {
      setCustomSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess('');
    setUploadError('');
    try {
      await uploadOnboardingDocument(file);
      setUploadSuccess(
        'Uploaded! Our AI agents are reviewing your document and will update your equipment profile shortly.',
      );
    } catch {
      setUploadError('Upload failed. Please try a different file.');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-6 w-6 text-teak-dark" />
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
          Tell us what you've got — your equipment profile powers our AI
          recommendations for products, production methods, and order routing.
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

      {/* Suggested Capabilities */}
      {suggestedCapabilities.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-900">
              Suggested Capabilities
            </h3>
            {loadingCapabilities && (
              <Spinner className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <p className="mt-1 text-xs text-blue-700 mb-3">
            Based on your equipment, the AI suggests you can offer these services:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedCapabilities.map((cap) => (
              <span
                key={cap.id}
                className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-900 border border-blue-200"
              >
                ✓ {cap.name}
              </span>
            ))}
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
            placeholder="Search equipment (e.g., Epson, Brother GTX, HP Indigo)..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
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
                    className="rounded bg-teak/15 px-3 py-1 text-xs font-medium text-teak-dark hover:bg-teak/20 disabled:opacity-50"
                  >
                    {addingId === eq.id ? '...' : '+ Add'}
                  </button>
                </div>
              ))}
          </div>
        )}

        {!searching && query.trim() && results.length === 0 && (
          <p className="text-sm text-gray-500">
            No equipment found for &quot;{query}&quot;. Try adding it as custom
            equipment below.
          </p>
        )}
      </div>

      {/* Custom Equipment Entry */}
      <div className="border-t pt-4">
        {!showCustomForm ? (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="text-sm font-medium text-teak-dark hover:text-teak"
          >
            + Add custom equipment not in the list
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-sm font-medium text-gray-700">
              Add Custom Equipment
            </h4>
            <p className="text-xs text-gray-500">
              Can't find your equipment? Add it here and our AI agents will
              research it to enrich your profile.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., My Custom Printer"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={customManufacturer}
                  onChange={(e) => setCustomManufacturer(e.target.value)}
                  placeholder="e.g., Epson"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Model Number
                </label>
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="e.g., SC-F2200"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                >
                  {EQUIPMENT_TYPES.filter((t) => t.value).map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCustomSubmit}
                disabled={!customName.trim() || customSaving}
                className="inline-flex items-center gap-2 rounded-md bg-teak-dark px-4 py-1.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
              >
                {customSaving && <Spinner className="h-3 w-3 text-white" />}
                Add Equipment
              </button>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            {customSuccess && (
              <p className="text-sm text-green-600">{customSuccess}</p>
            )}
          </div>
        )}
      </div>

      {/* File Upload */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-700">
          Have an equipment list or capabilities document?
        </h4>
        <p className="mt-1 text-xs text-gray-500">
          Upload a PDF, spreadsheet, or image and our AI agents will extract
          your equipment and capabilities automatically.
        </p>
        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            {uploading ? (
              <>
                <Spinner className="h-4 w-4" /> Uploading...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload File
              </>
            )}
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <span className="ml-3 text-xs text-gray-400">
            PDF, DOCX, XLSX, PNG, JPG (max 20MB)
          </span>
        </div>
        {uploadSuccess && (
          <p className="mt-2 text-sm text-green-600">{uploadSuccess}</p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-500">{uploadError}</p>
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
            className="rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
