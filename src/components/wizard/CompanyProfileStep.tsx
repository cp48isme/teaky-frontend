import { useState, type FormEvent } from 'react';
import { scrapeWebsite } from '../../api/scraping';
import type { ScrapeWebsiteResponse } from '../../types/scraping';
import Spinner from '../ui/Spinner';

export interface CompanyProfileData {
  companyName: string;
  websiteUrl: string;
  logoUrl: string;
  brandColors: string[];
  industry: string;
  description: string;
  phone: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
}

interface Props {
  data: CompanyProfileData;
  onUpdate: (partial: Partial<CompanyProfileData>) => void;
  onNext: () => void;
}

export default function CompanyProfileStep({ data, onUpdate, onNext }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState<ScrapeWebsiteResponse | null>(
    null,
  );
  const [showManualFields, setShowManualFields] = useState(false);

  const handleScan = async () => {
    if (!data.websiteUrl.trim()) return;
    setScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      const result = await scrapeWebsite(data.websiteUrl);
      setScanResult(result);

      // Auto-fill fields from scan results
      onUpdate({
        logoUrl: result.logo_url ?? '',
        brandColors: result.brand_colors ?? [],
        industry: result.industry ?? '',
        description: result.description ?? '',
        locationCity: result.location_city ?? '',
        locationState: result.location_state ?? '',
        locationCountry: result.location_country ?? '',
      });
    } catch {
      setScanError('Could not scan website. You can enter details manually.');
      setShowManualFields(true);
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.companyName.trim()) return;
    onNext();
  };

  const hasResults =
    scanResult &&
    (scanResult.logo_url ||
      scanResult.brand_colors?.length ||
      scanResult.industry);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Company Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your business. Enter your website URL and we'll
          auto-detect your branding.
        </p>
      </div>

      {/* Company Name (required) */}
      <div>
        <label
          htmlFor="company-name"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="company-name"
          type="text"
          required
          value={data.companyName}
          onChange={(e) => onUpdate({ companyName: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Website URL + Scan */}
      <div>
        <label
          htmlFor="website-url"
          className="block text-sm font-medium text-gray-700"
        >
          Website URL
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="website-url"
            type="url"
            value={data.websiteUrl}
            onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
            placeholder="https://yourcompany.com"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleScan}
            disabled={scanning || !data.websiteUrl.trim()}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {scanning ? (
              <>
                <Spinner className="h-4 w-4 text-white" /> Scanning...
              </>
            ) : (
              'Scan Website'
            )}
          </button>
        </div>
        {scanError && (
          <p className="mt-2 text-sm text-amber-600">{scanError}</p>
        )}
      </div>

      {/* Scan Results */}
      {hasResults && !showManualFields && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-indigo-900">
              We found this — look right?
            </h3>
            <button
              type="button"
              onClick={() => setShowManualFields(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Adjust
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Logo Preview */}
            {data.logoUrl && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Logo:</span>
                <img
                  src={data.logoUrl}
                  alt="Company logo"
                  className="mt-1 h-12 w-auto object-contain rounded bg-white p-1 border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Brand Colors */}
            {data.brandColors.length > 0 && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">
                  Brand Colors:
                </span>
                <div className="mt-1 flex gap-2">
                  {data.brandColors.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {data.industry && (
              <div>
                <span className="font-medium text-gray-600">Industry:</span>
                <p>{data.industry}</p>
              </div>
            )}

            {(data.locationCity || data.locationState) && (
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <p>
                  {[data.locationCity, data.locationState, data.locationCountry]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}

            {data.description && (
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Description:</span>
                <p className="line-clamp-2">{data.description}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              /* confirm keeps values, just dismiss the panel */
              setScanResult(null);
            }}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Manual Fields (shown after Adjust or scan failure) */}
      {(showManualFields || (!hasResults && !scanning)) && (
        <div className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
              </label>
              <input
                id="industry"
                type="text"
                value={data.industry}
                onChange={(e) => onUpdate({ industry: e.target.value })}
                placeholder="e.g., Custom Apparel Printing"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                value={data.locationCity}
                onChange={(e) => onUpdate({ locationCity: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                value={data.locationState}
                onChange={(e) => onUpdate({ locationState: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                value={data.locationCountry}
                onChange={(e) => onUpdate({ locationCountry: e.target.value })}
                placeholder="US"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!data.companyName.trim()}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </form>
  );
}
