import type { BrandConfig } from '../../types/portal';
import type { WizardProduct } from './ProductAddStep';
import type { PortalSettingsData } from './PortalSettingsStep';

interface Props {
  clientName: string;
  slug: string;
  brandConfig: BrandConfig;
  products: WizardProduct[];
  settings: PortalSettingsData;
  publishing: boolean;
  onPublish: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
}

export default function ReviewPublishStep({
  clientName,
  slug,
  brandConfig,
  products,
  settings,
  publishing,
  onPublish,
  onSaveDraft,
  onBack,
}: Props) {
  const primaryColor = brandConfig.primary_color || '#558B2F';
  const secondaryColor = brandConfig.secondary_color || '#7CB342';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review & Publish</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your portal before publishing it.
        </p>
      </div>

      {/* Split-screen layout */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left side: Review content (60%) */}
        <div className="lg:w-[60%] space-y-0">
          <div className="rounded-lg border border-gray-200 divide-y">
            {/* Portal Info */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Portal</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Name:</span>{' '}
                  <span className="text-gray-900">{clientName}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">URL:</span>{' '}
                  <span className="font-mono text-teak-dark">{slug}.teaky.com</span>
                </p>
              </div>
            </div>

            {/* Branding */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Branding</h3>
              <div className="mt-2 flex items-center gap-3">
                {brandConfig.logo_url && (
                  <img
                    src={brandConfig.logo_url}
                    alt=""
                    className="h-8 w-auto object-contain rounded border p-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex gap-1">
                  {[brandConfig.primary_color, brandConfig.secondary_color, brandConfig.accent_color]
                    .filter(Boolean)
                    .map((color, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color! }}
                        title={color!}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Products ({products.length})
              </h3>
              {products.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {products.map((p) => (
                    <li key={p._tempId} className="text-sm text-gray-900">
                      {p.name}
                      <span className="ml-2 text-xs text-gray-500">{p.category}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-400">No products added yet</p>
              )}
            </div>

            {/* Settings */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Settings</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <p>
                  Approval: <span className="font-medium">{settings.approvalWorkflow === 'none' ? 'None' : settings.approvalWorkflow.replace(/_/g, ' ')}</span>
                </p>
                <p>
                  Self-Registration: <span className="font-medium">{settings.selfRegistration ? 'Yes' : 'No'}</span>
                </p>
                <p>
                  Require PO: <span className="font-medium">{settings.requirePo ? 'Yes' : 'No'}</span>
                </p>
                {settings.customDomain && (
                  <p>
                    Custom Domain: <span className="font-medium font-mono">{settings.customDomain}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview Link */}
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-sm text-blue-700">
              After publishing, the portal will be accessible at:
            </p>
            <p className="mt-1 font-mono text-sm font-medium text-blue-900">
              /p/{slug}
            </p>
          </div>
        </div>

        {/* Right side: Visual preview (40%) */}
        <div className="lg:w-[40%]">
          <div className="sticky top-4">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Portal Preview
            </p>

            {/* Fake browser chrome */}
            <div className="rounded-lg border border-gray-300 bg-gray-100 shadow-sm overflow-hidden">
              {/* Browser toolbar */}
              <div className="flex items-center gap-2 border-b border-gray-300 bg-gray-200 px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 rounded-md bg-white px-3 py-1 text-[10px] text-gray-400 font-mono truncate">
                  {slug || 'your-portal'}.teaky.com
                </div>
              </div>

              {/* Portal header */}
              <div className="px-4 py-3" style={{ backgroundColor: primaryColor }}>
                <div className="flex items-center gap-2">
                  {brandConfig.logo_url ? (
                    <img
                      src={brandConfig.logo_url}
                      alt=""
                      className="h-6 w-auto object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-6 w-6 rounded bg-white/20" />
                  )}
                  <span className="text-sm font-semibold text-white truncate">
                    {clientName || 'Portal Name'}
                  </span>
                </div>
              </div>

              {/* Portal body */}
              <div className="bg-white p-4">
                {/* Banner area */}
                {brandConfig.banner_image_url ? (
                  <div className="mb-3 h-16 rounded-md overflow-hidden">
                    <img
                      src={brandConfig.banner_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="mb-3 h-16 rounded-md opacity-10"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}

                {/* Section title */}
                <p className="text-xs font-semibold text-gray-700 mb-2">Products</p>

                {/* Sample product grid */}
                <div className="grid grid-cols-2 gap-2">
                  {(products.length > 0 ? products.slice(0, 4) : [
                    { _tempId: '1', name: 'Sample Product', category: 'apparel' },
                    { _tempId: '2', name: 'Another Item', category: 'signage' },
                  ]).map((p) => (
                    <div
                      key={p._tempId}
                      className="rounded-md border border-gray-200 p-2"
                    >
                      <div className="h-12 rounded bg-gray-100 mb-1.5" />
                      <p className="text-[10px] font-medium text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-gray-400">{p.category}</p>
                      <div
                        className="mt-1 rounded px-1.5 py-0.5 text-[9px] font-medium text-white text-center"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        View
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-3 border-t pt-2 text-center">
                  <p className="text-[9px] text-gray-300">
                    Powered by Teaky
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={publishing}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className="rounded-md bg-teak-dark px-6 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
