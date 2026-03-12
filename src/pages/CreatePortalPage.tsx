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
import DescribePortalStep from '../components/portal-wizard/DescribePortalStep';
import AICreatedResultsStep from '../components/portal-wizard/AICreatedResultsStep';
import AddLocationsStep from '../components/portal-wizard/AddLocationsStep';
import { createPortal, publishPortal, updatePortal, type StoreCreationResult } from '../api/portals';
import { createProduct } from '../api/products';
import type { BrandConfig, Portal } from '../types/portal';
import Spinner from '../components/ui/Spinner';

const MANUAL_STEPS = [
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
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResult, setAiResult] = useState<StoreCreationResult | null>(null);

  // Wizard-wide state
  const [clientInfo, setClientInfo] = useState<ClientInfoData>({
    clientName: '',
    websiteUrl: '',
    slug: '',
    brandConfig: { ...DEFAULT_BRAND_CONFIG },
    isFranchise: false,
  });

  const [createdPortal, setCreatedPortal] = useState<Portal | null>(null);

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

      // 1b. Mark as template if franchise mode
      if (clientInfo.isFranchise) {
        const updatedPortal = await updatePortal(portal.id, { is_template: true });
        setCreatedPortal(updatedPortal);
      }

      // 1c. Set custom domain if provided
      if (portalSettings.customDomain) {
        await updatePortal(portal.id, { custom_domain: portalSettings.customDomain });
      }

      // 2. Create all products (categories auto-created from products)
      for (const product of products) {
        const { _tempId, ...productData } = product;
        await createProduct(portal.id, productData);
      }

      // 3. Publish if requested
      if (publish) {
        await publishPortal(portal.id);
      }

      // 4. If franchise mode, go to AddLocationsStep; otherwise navigate away
      if (clientInfo.isFranchise) {
        setCreatedPortal(portal);
        setCurrentStep(6); // AddLocationsStep
      } else {
        navigate('/portals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <div className={`${currentStep === 4 ? 'max-w-5xl' : 'max-w-3xl'} mx-auto w-full px-4 py-8 flex-1 transition-all`}>
        <h1 className="font-heading text-3xl font-extrabold text-brand-dark mb-8 lg:text-4xl">Create Portal</h1>

        {/* Step indicator */}
        <nav className="mb-8">
          <ol className="flex items-center">
            {isAIMode && aiResult ? (
              // AI mode - show just the result step
              <li className="flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 bg-teak-dark text-white">
                  ✓
                </span>
                <span className="ml-2 text-sm text-gray-600 hidden lg:inline whitespace-nowrap">
                  Portal Created
                </span>
              </li>
            ) : (
              // Manual mode
              [
                'Describe',
                ...MANUAL_STEPS,
              ].map((step, index) => (
                <li key={step} className="flex items-center">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                          ? 'bg-teak-dark text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? '\u2713' : index + 1}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 hidden lg:inline whitespace-nowrap">
                    {step}
                  </span>
                  {index < MANUAL_STEPS.length && (
                    <div
                      className={`w-8 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </li>
              ))
            )}
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
          {/* AI Mode - Show results */}
          {isAIMode && aiResult && (
            <AICreatedResultsStep
              result={aiResult}
              onCreateNew={() => {
                setAiResult(null);
                setIsAIMode(false);
                setCurrentStep(0);
              }}
            />
          )}

          {/* Manual Mode */}
          {!isAIMode && (
            <>
              {currentStep === 0 && (
                <DescribePortalStep
                  onSuccess={(result) => {
                    setAiResult(result);
                    setIsAIMode(true);
                  }}
                  onBuildManually={() => {
                    setIsAIMode(false);
                    setCurrentStep(1);
                  }}
                />
              )}
              {currentStep === 1 && (
                <ClientInfoStep
                  data={clientInfo}
                  onUpdate={(partial) =>
                    setClientInfo((prev) => ({ ...prev, ...partial }))
                  }
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && (
                <BrandReviewStep
                  clientName={clientInfo.clientName}
                  brandConfig={clientInfo.brandConfig}
                  onUpdate={handleBrandConfigUpdate}
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
              {currentStep === 6 && createdPortal && (
                <AddLocationsStep
                  templatePortal={createdPortal}
                  onComplete={(_portals) => {
                    // Show success and navigate
                    navigate('/portals');
                  }}
                  onSkip={() => {
                    // User can add locations later
                    navigate('/portals');
                  }}
                />
              )}
            </>
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
