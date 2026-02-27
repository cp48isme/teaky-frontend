import { type FormEvent } from 'react';
import { uploadFile } from '../../api/uploads';
import type { BrandConfig } from '../../types/portal';

interface Props {
  clientName: string;
  brandConfig: BrandConfig;
  onUpdate: (config: BrandConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BrandReviewStep({
  clientName,
  brandConfig,
  onUpdate,
  onNext,
  onBack,
}: Props) {
  const handleColorChange = (field: keyof BrandConfig, value: string) => {
    onUpdate({ ...brandConfig, [field]: value });
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const result = await uploadFile(file);
      onUpdate({ ...brandConfig, logo_url: result.url });
    } catch {
      // best-effort
    }
  };

  const handleFaviconUpload = async (file: File) => {
    try {
      const result = await uploadFile(file);
      onUpdate({ ...brandConfig, favicon_url: result.url });
    } catch {
      // best-effort
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Brand Review</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize the branding for {clientName}'s portal.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            {brandConfig.logo_url && (
              <img
                src={brandConfig.logo_url}
                alt="Logo preview"
                className="mt-1 mb-2 h-12 w-auto object-contain rounded bg-white p-1 border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              className="mt-1 block text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Favicon</label>
            {brandConfig.favicon_url && (
              <img
                src={brandConfig.favicon_url}
                alt="Favicon preview"
                className="mt-1 mb-2 h-6 w-6 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFaviconUpload(e.target.files[0])}
              className="mt-1 block text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Brand Colors</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500">Primary</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={brandConfig.primary_color || '#4F46E5'}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandConfig.primary_color || ''}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    placeholder="#4F46E5"
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Secondary</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={brandConfig.secondary_color || '#6B7280'}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandConfig.secondary_color || ''}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    placeholder="#6B7280"
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Accent</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={brandConfig.accent_color || '#F59E0B'}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={brandConfig.accent_color || ''}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    placeholder="#F59E0B"
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Powered by Teaky */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={brandConfig.powered_by_teaky}
              onChange={(e) => onUpdate({ ...brandConfig, powered_by_teaky: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700">Show "Powered by Teaky" badge</span>
          </label>
        </div>

        {/* Right: Preview */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Preview</p>
          <div className="rounded-lg bg-white shadow overflow-hidden">
            {/* Header preview */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: brandConfig.primary_color || '#4F46E5' }}
            >
              {brandConfig.logo_url && (
                <img
                  src={brandConfig.logo_url}
                  alt=""
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span className="text-sm font-semibold text-white">{clientName}</span>
            </div>
            {/* Content preview */}
            <div className="p-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded bg-gray-100 p-3">
                    <div className="h-8 w-full rounded bg-gray-200" />
                    <div className="mt-2 h-2 w-3/4 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
            {/* Footer preview */}
            {brandConfig.powered_by_teaky && (
              <div className="border-t px-4 py-2 text-center">
                <span className="text-xs text-gray-400">Powered by Teaky</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}
