import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientInfoStep, {
  type ClientInfoData,
} from '../components/portal-wizard/ClientInfoStep';
import BrandReviewStep from '../components/portal-wizard/BrandReviewStep';
import ProductAddStep, {
  type WizardProduct,
} from '../components/portal-wizard/ProductAddStep';
import PortalSettingsStep, {
  type PortalSettingsData,
} from '../components/portal-wizard/PortalSettingsStep';
import ReviewPublishStep from '../components/portal-wizard/ReviewPublishStep';
import { createPortal, publishPortal, updatePortal } from '../api/portals';
import { createProduct } from '../api/products';
import { createCategory } from '../api/categories';
import type { BrandConfig } from '../types/portal';
import Spinner from '../components/ui/Spinner';

const STEPS = [
  'Client Info',
  'Brand Review',
  'Categories',
  'Add Products',
  'Portal Settings',
  'Review & Publish',
];

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  logo_url: null,
  favicon_url: null,
  primary_color: null,
  secondary_color: null,
  accent_color: null,
  banner_image_url: null,
  powered_by_teaky: true,
};

export default function CreatePortalPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  // Wizard-wide state
  const [clientInfo, setClientInfo] = useState<ClientInfoData>({
    clientName: '',
    websiteUrl: '',
    slug: '',
    brandConfig: { ...DEFAULT_BRAND_CONFIG },
  });

  const [products, setProducts] = useState<WizardProduct[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

  const [portalSettings, setPortalSettings] = useState<PortalSettingsData>({
    approvalWorkflow: 'none',
    selfRegistration: false,
    requirePo: false,
    customDomain: '',
  });

  const handleBrandConfigUpdate = (config: BrandConfig) => {
    setClientInfo((prev) => ({ ...prev, brandConfig: config }));
  };

  const handleFinish = async (publish: boolean) => {
    setPublishing(true);
    setError('');

    try {
      // 1. Create the portal
      const portal = await createPortal({
        name: clientInfo.clientName,
        slug: clientInfo.slug,
        brand_config: clientInfo.brandConfig,
      });

      // 1b. Set custom domain if provided
      if (portalSettings.customDomain) {
        await updatePortal(portal.id, { custom_domain: portalSettings.customDomain });
      }

      // 2. Create categories
      for (const [i, name] of categoryNames.entries()) {
        if (name.trim()) {
          const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          await createCategory(portal.id, { name: name.trim(), slug, sort_order: i });
        }
      }

      // 3. Create all products
      for (const product of products) {
        const { _tempId, ...productData } = product;
        await createProduct(portal.id, productData);
      }

      // 4. Publish if requested
      if (publish) {
        await publishPortal(portal.id);
      }

      navigate('/portals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className={`${currentStep === 5 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto w-full px-4 py-8 flex-1 transition-all`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Portal</h1>

        {/* Step indicator */}
        <nav className="mb-8">
          <ol className="flex items-center">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? '\u2713' : index + 1}
                </span>
                <span className="ml-2 text-sm text-gray-600 hidden lg:inline whitespace-nowrap">
                  {step}
                </span>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Error display */}
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 min-h-[300px]">
          {currentStep === 0 && (
            <ClientInfoStep
              data={clientInfo}
              onUpdate={(partial) =>
                setClientInfo((prev) => ({ ...prev, ...partial }))
              }
              onNext={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 1 && (
            <BrandReviewStep
              clientName={clientInfo.clientName}
              brandConfig={clientInfo.brandConfig}
              onUpdate={handleBrandConfigUpdate}
              onNext={() => setCurrentStep(2)}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && (
            <CategoryStep
              categories={categoryNames}
              onUpdate={setCategoryNames}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <ProductAddStep
              products={products}
              onUpdate={setProducts}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <PortalSettingsStep
              slug={clientInfo.slug}
              data={portalSettings}
              onUpdate={(partial) =>
                setPortalSettings((prev) => ({ ...prev, ...partial }))
              }
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <ReviewPublishStep
              clientName={clientInfo.clientName}
              slug={clientInfo.slug}
              brandConfig={clientInfo.brandConfig}
              products={products}
              settings={portalSettings}
              publishing={publishing}
              onPublish={() => handleFinish(true)}
              onSaveDraft={() => handleFinish(false)}
              onBack={() => setCurrentStep(4)}
            />
          )}
        </div>

        {/* Publishing indicator */}
        {publishing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Spinner className="h-4 w-4" /> Creating portal...
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Category Step ---- */

interface CategoryStepProps {
  categories: string[];
  onUpdate: (categories: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function CategoryStep({ categories, onUpdate, onNext, onBack }: CategoryStepProps) {
  const [newName, setNewName] = useState('');

  const addCategory = () => {
    if (!newName.trim()) return;
    onUpdate([...categories, newName.trim()]);
    setNewName('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <p className="mt-1 text-sm text-gray-500">
          Define product categories for your portal. You can add more later.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
          placeholder="e.g. Apparel, Signage, Business Cards..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addCategory}
          disabled={!newName.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {categories.length > 0 ? (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {categories.map((name, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-900">{name}</span>
              <button
                type="button"
                onClick={() => onUpdate(categories.filter((_, j) => j !== i))}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
          No categories yet. You can skip this step and add them later.
        </p>
      )}

      <div className="flex justify-between border-t pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
