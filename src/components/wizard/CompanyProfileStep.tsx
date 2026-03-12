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
  const [scanAttempted, setScanAttempted] = useState(false);

  const handleScan = async () => {
    if (!data.websiteUrl.trim()) return;

    // Normalize URL: add https:// if no scheme
    let normalizedUrl = data.websiteUrl.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
      onUpdate({ websiteUrl: normalizedUrl });
    }

    // Basic URL validation
    try {
      new URL(normalizedUrl);
    } catch {
      setScanError('Please enter a valid website URL (e.g., yourcompany.com)');
      return;
    }

    setScanning(true);
    setScanError('');
    setScanResult(null);
    setScanAttempted(false);

    try {
      const result = await scrapeWebsite(normalizedUrl);

      // Check if we got any useful results
      const hasData =
        result.logo_url ||
        (result.brand_colors && result.brand_colors.length > 0) ||
        result.industry ||
        result.description;

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

      // If no data was found, show manual fields
      if (!hasData) {
        setShowManualFields(true);
      }
    } catch (error) {
      console.error('Website scan failed:', error);
      setScanError(
        'Could not scan website. Please check the URL and try again, or enter details manually.',
      );
      setShowManualFields(true);
    } finally {
      setScanning(false);
      setScanAttempted(true);
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
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
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
          />
          <button
            type="button"
            onClick={handleScan}
            disabled={scanning || !data.websiteUrl.trim()}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
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

      {/* Enhanced Scan Results Card */}
      {hasResults && !showManualFields && (
        <div className="rounded-lg border border-teak/30 bg-white shadow-sm overflow-hidden">
          <div className="bg-teak/10 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-teak-dark">
              Here's what we found
            </h3>
            <button
              type="button"
              onClick={() => setShowManualFields(true)}
              className="text-sm text-teak-dark hover:text-teak"
            >
              Edit
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Logo */}
            {data.logoUrl && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-24 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2">
                  <img
                    src={data.logoUrl}
                    alt="Company logo"
                    className="max-h-12 max-w-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Logo
                  </span>
                  <p className="text-sm text-gray-700">Detected from your site</p>
                </div>
              </div>
            )}

            {/* Brand Colors */}
            {data.brandColors.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Brand Colors
                </span>
                <div className="mt-2 flex items-center gap-3">
                  {data.brandColors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Industry */}
              {data.industry && (
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Industry
                  </span>
                  <p className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                      {data.industry}
                    </span>
                  </p>
                </div>
              )}

              {/* Location */}
              {(data.locationCity || data.locationState) && (
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Location
                  </span>
                  <p className="mt-1 text-sm text-gray-700">
                    {[data.locationCity, data.locationState, data.locationCountry]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {data.description && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </span>
                <p className="mt-1 text-sm text-gray-700 line-clamp-3">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
            <button
              type="button"
              onClick={() => setScanResult(null)}
              className="rounded-md bg-teak-dark px-4 py-1.5 text-sm font-medium text-white hover:bg-teak"
            >
              Looks good
            </button>
            <button
              type="button"
              onClick={() => setShowManualFields(true)}
              className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Make changes
            </button>
          </div>
        </div>
      )}

      {/* Scan completed but found nothing */}
      {scanAttempted && !hasResults && !scanError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            We scanned your site but couldn't auto-detect branding details. No
            worries — fill in the fields below manually.
          </p>
        </div>
      )}

      {/* Manual Fields (shown after Edit or scan failure) */}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!data.companyName.trim()}
          className="rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </form>
  );
}
