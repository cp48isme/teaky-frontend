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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review & Publish</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your portal before publishing it.
        </p>
      </div>

      {/* Summary */}
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
              <span className="font-mono text-indigo-600">{slug}.teaky.com</span>
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
          </div>
        </div>
      </div>

      {/* Preview Link */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
        <p className="text-sm text-blue-700">
          After publishing, the portal will be accessible at:
        </p>
        <p className="mt-1 font-mono text-sm font-medium text-blue-900">
          /p/{slug}
        </p>
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
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
