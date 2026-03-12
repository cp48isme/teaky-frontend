import { useState, type FormEvent } from 'react';
import { createPortalFromDescription, type StoreCreationResult, type BrandData } from '../../api/portals';
import { scrapeWebsite } from '../../api/scraping';
import Spinner from '../ui/Spinner';
import ScanProgress from '../ui/ScanProgress';
import type { ScrapeWebsiteResponse } from '../../types/scraping';

interface Props {
  onSuccess: (result: StoreCreationResult) => void;
  onBuildManually: () => void;
}

export default function DescribePortalStep({ onSuccess, onBuildManually }: Props) {
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState<ScrapeWebsiteResponse | null>(null);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setCreating(true);
    setError('');

    try {
      let brandData: BrandData | undefined;

      if (websiteUrl.trim() && !scanResult) {
        // Scan the website if URL provided and not yet scanned
        setScanning(true);
        try {
          const result = await scrapeWebsite(websiteUrl);
          setScanResult(result);
          brandData = {
            logo_url: result.logo_url,
            colors: result.brand_colors || [],
            industry: result.industry,
            description: result.description,
          };
        } catch {
          // Silently continue if scan fails - description is still usable
        } finally {
          setScanning(false);
        }
      } else if (scanResult) {
        // Use previously scanned data
        brandData = {
          logo_url: scanResult.logo_url,
          colors: scanResult.brand_colors || [],
          industry: scanResult.industry,
          description: scanResult.description,
        };
      }

      const result = await createPortalFromDescription(description, brandData);
      onSuccess(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create portal from description',
      );
    } finally {
      setCreating(false);
    }
  };

  const handleScanWebsite = async () => {
    if (!websiteUrl.trim()) return;

    setScanning(true);
    setError('');
    setScanResult(null);

    try {
      const result = await scrapeWebsite(websiteUrl);
      setScanResult(result);
    } catch (err) {
      setError('Could not scan website. No problem — you can proceed without it.');
    } finally {
      setScanning(false);
    }
  };

  const applyExample = (example: string) => {
    setDescription(example);
  };

  const EXAMPLE_DESCRIPTIONS = [
    "Employee uniforms and branded apparel for a corporate client — need polo shirts, t-shirts, and hoodies in company colors with bulk order discounts",
    "Golf tournament merchandise package for 200 attendees — golf balls, hats, towels, and custom tees with embroidery or printing",
    "New auto dealership opening — business cards, signage, window vinyl, vehicle wraps, and dealer uniforms in their brand colors",
    "School spirit wear store — t-shirts, hoodies, and accessories for students with school logo and various sizes/colors",
  ];

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Let's Create Your Store</h2>
        <p className="mt-2 text-base text-gray-600">
          Describe your client and what they need. Our AI will instantly create a professional portal with products, categories, and branding.
        </p>
      </div>

      {/* Example Description Chips */}
      <div>
        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Start Examples</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EXAMPLE_DESCRIPTIONS.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyExample(example)}
              className="text-left rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 transition hover:border-teak hover:bg-teak-light/5 hover:shadow-sm"
            >
              <span className="block font-medium text-gray-800">{example.slice(0, 50)}…</span>
              <span className="text-xs text-gray-500">Click to use this template</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
          Your Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your client: their name, industry, what products they need, quantities, colors, and any special requirements..."
          rows={5}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-teak focus:outline-none focus:ring-2 focus:ring-teak/20 sm:text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          The more details you provide, the better our AI can create the perfect portal.
        </p>
      </div>

      {/* Website URL field */}
      <div>
        <label htmlFor="website" className="block text-sm font-semibold text-gray-900">
          Client Website <span className="text-gray-400">(Optional)</span>
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            id="website"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-teak focus:outline-none focus:ring-2 focus:ring-teak/20 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleScanWebsite}
            disabled={!websiteUrl.trim() || scanning}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {scanning ? (
              <Spinner className="h-4 w-4" />
            ) : (
              'Scan'
            )}
          </button>
        </div>
        {scanResult && (
          <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-medium text-green-800">
              ✓ Website scanned — brand info will be included in portal creation
            </p>
            {scanResult.industry && (
              <p className="mt-1 text-xs text-green-700">
                <span className="font-medium">Industry:</span> {scanResult.industry}
              </p>
            )}
            {scanResult.brand_colors?.length ? (
              <div className="mt-2 flex gap-2">
                <span className="text-xs font-medium text-green-700">Colors:</span>
                {scanResult.brand_colors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded border border-green-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          We'll extract your client's branding, logo, and colors to make the portal match their identity.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700 font-medium">Unable to scan</p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Creating progress */}
      {(creating || scanning) && <ScanProgress isScanning={creating || scanning} />}

      {/* Primary Action Button */}
      <button
        type="submit"
        disabled={creating || scanning || !description.trim()}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teak to-teak-dark px-6 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg hover:from-teak-dark hover:to-teak disabled:opacity-50"
      >
        {creating || scanning ? (
          <>
            <Spinner className="h-4 w-4 text-white" />
            {scanning ? 'Scanning...' : 'Creating Portal...'}
          </>
        ) : (
          <>
            Create Portal with AI
            <span className="text-lg">→</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Usually takes 15-30 seconds. Our AI agents will create products, categories, and setup your portal.
      </p>

      {/* Manual Fallback Link */}
      <div className="border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={onBuildManually}
          disabled={creating || scanning}
          className="w-full text-center text-sm text-gray-600 transition hover:text-teak disabled:opacity-50"
        >
          Prefer to build manually? Click here →
        </button>
      </div>
    </form>
  );
}
