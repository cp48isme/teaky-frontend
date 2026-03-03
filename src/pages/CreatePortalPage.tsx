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
import { createPortal, publishPortal } from '../api/portals';
import { createProduct } from '../api/products';
import type { BrandConfig } from '../types/portal';
import Spinner from '../components/ui/Spinner';

const STEPS = [
  'Client Info',
  'Brand Review',
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

      // 2. Create all products
      for (const product of products) {
        const { _tempId, ...productData } = product;
        await createProduct(portal.id, productData);
      }

      // 3. Publish if requested
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
      <div className={`${currentStep === 4 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto w-full px-4 py-8 flex-1 transition-all`}>
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
            <ProductAddStep
              products={products}
              onUpdate={setProducts}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <PortalSettingsStep
              slug={clientInfo.slug}
              data={portalSettings}
              onUpdate={(partial) =>
                setPortalSettings((prev) => ({ ...prev, ...partial }))
              }
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <ReviewPublishStep
              clientName={clientInfo.clientName}
              slug={clientInfo.slug}
              brandConfig={clientInfo.brandConfig}
              products={products}
              settings={portalSettings}
              publishing={publishing}
              onPublish={() => handleFinish(true)}
              onSaveDraft={() => handleFinish(false)}
              onBack={() => setCurrentStep(3)}
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
