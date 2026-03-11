import { useState, type FormEvent } from 'react';
import { duplicatePortalBatch } from '../../api/portals';
import type { Portal, LocationRequest } from '../../types/portal';
import Spinner from '../ui/Spinner';

interface Props {
  templatePortal: Portal;
  onComplete: (portals: Portal[]) => void;
  onSkip: () => void;
}

export default function AddLocationsStep({ templatePortal, onComplete, onSkip }: Props) {
  const [locations, setLocations] = useState<LocationRequest[]>([
    { location_name: '', location_address: '', custom_subdomain: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLocation = () => {
    setLocations([...locations, { location_name: '', location_address: '', custom_subdomain: '' }]);
  };

  const removeLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const updateLocation = (index: number, field: keyof LocationRequest, value: string) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocations(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty locations
    const validLocations = locations.filter((loc) => loc.location_name.trim() !== '');

    if (validLocations.length === 0) {
      setError('Please add at least one location');
      setLoading(false);
      return;
    }

    try {
      setProgress({ current: 0, total: validLocations.length });

      const result = await duplicatePortalBatch(templatePortal.id, { locations: validLocations });

      setProgress({ current: result.total_created, total: validLocations.length });
      onComplete(result.portals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create locations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Add Your Locations</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add all franchise locations based on your template portal: <strong>{templatePortal.name}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location List */}
        <div className="space-y-3">
          {locations.map((location, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Location {index + 1}</h3>
                {locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location.location_name}
                    onChange={(e) => updateLocation(index, 'location_name', e.target.value)}
                    placeholder="e.g., Downtown Seattle"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Location Address <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location.location_address || ''}
                    onChange={(e) => updateLocation(index, 'location_address', e.target.value)}
                    placeholder="e.g., 123 Main St, Seattle, WA 98101"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Custom Subdomain <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-gray-500">teaky.com/p/</span>
                    <input
                      type="text"
                      value={location.custom_subdomain || ''}
                      onChange={(e) =>
                        updateLocation(
                          index,
                          'custom_subdomain',
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                        )
                      }
                      placeholder="auto-generated from location name"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Leave blank to auto-generate from location name
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Location Button */}
        <button
          type="button"
          onClick={addLocation}
          className="w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 hover:border-teak hover:text-teak"
        >
          + Add Another Location
        </button>

        {/* Progress Indicator */}
        {loading && progress.total > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              Creating location {progress.current} of {progress.total}...
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-200">
              <div
                className="h-full bg-teak transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            disabled={loading || locations.every((loc) => !loc.location_name.trim())}
            className="inline-flex items-center gap-2 rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {loading && <Spinner className="h-4 w-4 text-white" />}
            Create All Locations
          </button>
        </div>
      </form>
    </div>
  );
}
