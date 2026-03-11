import { useState, useEffect, type FormEvent } from 'react';
import { scrapeWebsite } from '../../api/scraping';
import { checkSlugAvailable } from '../../api/portals';
import type { ScrapeWebsiteResponse } from '../../types/scraping';
import type { BrandConfig } from '../../types/portal';
import Spinner from '../ui/Spinner';
import ScanProgress from '../ui/ScanProgress';

export interface ClientInfoData {
  clientName: string;
  websiteUrl: string;
  slug: string;
  brandConfig: BrandConfig;
  isFranchise: boolean;
}

interface Props {
  data: ClientInfoData;
  onUpdate: (partial: Partial<ClientInfoData>) => void;
  onNext: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ClientInfoStep({ data, onUpdate, onNext }: Props) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanResult, setScanResult] = useState<ScrapeWebsiteResponse | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Auto-generate slug from client name
  useEffect(() => {
    if (data.clientName.trim()) {
      const slug = generateSlug(data.clientName);
      onUpdate({ slug });
    }
  }, [data.clientName]);

  // Debounced slug availability check
  useEffect(() => {
    if (!data.slug || data.slug.length < 2) {
      setSlugAvailable(null);
      return;
    }

    setCheckingSlug(true);
    const timer = setTimeout(async () => {
      try {
        const result = await checkSlugAvailable(data.slug);
        setSlugAvailable(result.available);
      } catch {
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [data.slug]);

  const handleScan = async () => {
    if (!data.websiteUrl.trim()) return;
    setScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      const result = await scrapeWebsite(data.websiteUrl);
      setScanResult(result);

      // Auto-fill brand config from scan results
      onUpdate({
        brandConfig: {
          ...data.brandConfig,
          logo_url: result.logo_url ?? data.brandConfig.logo_url,
          primary_color: result.brand_colors?.[0] ?? data.brandConfig.primary_color,
          secondary_color: result.brand_colors?.[1] ?? data.brandConfig.secondary_color,
          accent_color: result.brand_colors?.[2] ?? data.brandConfig.accent_color,
        },
      });
    } catch {
      setScanError('Could not scan website. You can configure branding in the next step.');
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!data.clientName.trim() || !data.slug.trim()) return;
    if (slugAvailable === false) return;
    onNext();
  };

  const hasResults = scanResult && (scanResult.logo_url || scanResult.brand_colors?.length);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Client Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the client's name and website. We'll auto-detect their branding.
        </p>
      </div>

      {/* Client Name */}
      <div>
        <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">
          Client Name <span className="text-red-500">*</span>
        </label>
        <input
          id="client-name"
          type="text"
          required
          value={data.clientName}
          onChange={(e) => onUpdate({ clientName: e.target.value })}
          placeholder="e.g., Ace Hardware"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
        />
      </div>

      {/* Website URL + Scan */}
      <div>
        <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="website-url"
            type="url"
            value={data.websiteUrl}
            onChange={(e) => onUpdate({ websiteUrl: e.target.value })}
            placeholder="https://client-website.com"
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
              'Scan'
            )}
          </button>
        </div>
        {scanError && <p className="mt-2 text-sm text-amber-600">{scanError}</p>}
      </div>

      {/* Scan Progress */}
      <ScanProgress isScanning={scanning} />

      {/* Scan Results Preview */}
      {hasResults && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
          <h3 className="text-sm font-medium text-green-900">Brand detected!</h3>
          <div className="flex items-center gap-4">
            {data.brandConfig.logo_url && (
              <img
                src={data.brandConfig.logo_url}
                alt="Client logo"
                className="h-10 w-auto object-contain rounded bg-white p-1 border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            {(data.brandConfig.primary_color || data.brandConfig.secondary_color || data.brandConfig.accent_color) && (
              <div className="flex gap-2">
                {[data.brandConfig.primary_color, data.brandConfig.secondary_color, data.brandConfig.accent_color]
                  .filter(Boolean)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color! }}
                      title={color!}
                    />
                  ))}
              </div>
            )}
          </div>
          <p className="text-xs text-green-700">You can fine-tune branding in the next step.</p>
        </div>
      )}

      {/* Portal Slug */}
      <div>
        <label htmlFor="portal-slug" className="block text-sm font-medium text-gray-700">
          Portal URL <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-sm text-gray-500">teaky.com/p/</span>
          <input
            id="portal-slug"
            type="text"
            required
            value={data.slug}
            onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
          />
        </div>
        {checkingSlug && <p className="mt-1 text-xs text-gray-400">Checking availability...</p>}
        {!checkingSlug && slugAvailable === true && (
          <p className="mt-1 text-xs text-green-600">&#10003; Available</p>
        )}
        {!checkingSlug && slugAvailable === false && (
          <p className="mt-1 text-xs text-red-600">This slug is already taken</p>
        )}
      </div>

      {/* Franchise / Multi-Location Toggle */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isFranchise}
            onChange={(e) => onUpdate({ isFranchise: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-teak-dark focus:ring-teak"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              This is a franchise or multi-location business
            </span>
            <p className="mt-1 text-xs text-gray-600">
              Enable this if you need to create the same portal for multiple locations
              (e.g., franchise stores, regional offices). You'll be able to add locations
              after the portal is created.
            </p>
          </div>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!data.clientName.trim() || !data.slug.trim() || slugAvailable === false}
          className="rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </form>
  );
}
