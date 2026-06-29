import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompanyProfileStep, {
  type CompanyProfileData,
} from '../components/wizard/CompanyProfileStep';
import EquipmentStep from '../components/wizard/EquipmentStep';
import CapabilitiesStep from '../components/wizard/CapabilitiesStep';
import PricingStep from '../components/wizard/PricingStep';
import PlanStep from '../components/wizard/PlanStep';
import CreatePortalStep from '../components/wizard/CreatePortalStep';
import {
  createCompanyProfile,
  getCompanyProfileByOrg,
  updateCompanyProfile,
} from '../api/companyProfiles';
import type { BrandColors } from '../types/companyProfile';
import { getOrgEquipment } from '../api/equipment';
import { getOrgCapabilities } from '../api/capabilities';
import { useOrganizationId } from '../hooks/useOrganizationId';
import { ApiError } from '../api/client';
import Spinner from '../components/ui/Spinner';

const STEPS = [
  'Company Profile',
  'Equipment',
  'Capabilities',
  'Pricing',
  'Your Plan',
  'Get Started',
];

export default function GetStartedWizardPage() {
  const orgId = useOrganizationId();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Wizard-wide state
  const [companyData, setCompanyData] = useState<CompanyProfileData>({
    companyName: '',
    websiteUrl: '',
    logoUrl: '',
    brandColors: [],
    industry: '',
    description: '',
    phone: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
  });

  const [pricingApproach, setPricingApproach] = useState<string | null>(null);
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [capabilityCount, setCapabilityCount] = useState(0);
  const [orgEquipmentIds, setOrgEquipmentIds] = useState<string[]>([]);

  // Load existing profile if any (resume wizard)
  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const profile = await getCompanyProfileByOrg(orgId);
        setProfileId(profile.id);

        // Convert brand_colors dict back to array format for UI
        const brandColorsArray: string[] = [];
        if (profile.brand_colors) {
          if (profile.brand_colors.primary) brandColorsArray.push(profile.brand_colors.primary);
          if (profile.brand_colors.secondary) brandColorsArray.push(profile.brand_colors.secondary);
          if (profile.brand_colors.accent) brandColorsArray.push(profile.brand_colors.accent);
          if (profile.brand_colors.tertiary) brandColorsArray.push(profile.brand_colors.tertiary);
          if (profile.brand_colors.quaternary) brandColorsArray.push(profile.brand_colors.quaternary);
        }

        setCompanyData((prev) => ({
          ...prev,
          websiteUrl: profile.website_url ?? prev.websiteUrl,
          logoUrl: profile.logo_url ?? prev.logoUrl,
          brandColors: brandColorsArray.length > 0 ? brandColorsArray : prev.brandColors,
          industry: profile.industry ?? prev.industry,
          description: profile.description ?? prev.description,
          phone: profile.phone ?? prev.phone,
          locationCity: profile.location_city ?? prev.locationCity,
          locationState: profile.location_state ?? prev.locationState,
          locationCountry: profile.location_country ?? prev.locationCountry,
        }));
      } catch {
        // No profile yet — that's fine
      }
      try {
        const eq = await getOrgEquipment(orgId);
        setEquipmentCount(eq.length);
        setOrgEquipmentIds(eq.map((e) => e.equipment_id));
      } catch {
        // ignore
      }
      try {
        const caps = await getOrgCapabilities(orgId);
        setCapabilityCount(caps.length);
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, [orgId]);

  const handleCompanyNext = async () => {
    if (!orgId) return;
    setSaving(true);
    try {
      // Convert brandColors array to BrandColors shape expected by backend.
      // `|| undefined` preserves omit-on-empty PATCH semantics: JSON.stringify
      // drops undefined values, so empty/missing entries do not clear BE state.
      const brandColorsDict: BrandColors | undefined = companyData.brandColors.length > 0
        ? {
            primary: companyData.brandColors[0] || undefined,
            secondary: companyData.brandColors[1] || undefined,
            accent: companyData.brandColors[2] || undefined,
            tertiary: companyData.brandColors[3] || undefined,
            quaternary: companyData.brandColors[4] || undefined,
          }
        : undefined;

      if (profileId) {
        // Update existing profile
        await updateCompanyProfile(profileId, {
          website_url: companyData.websiteUrl || undefined,
          logo_url: companyData.logoUrl || undefined,
          industry: companyData.industry || undefined,
          description: companyData.description || undefined,
          phone: companyData.phone || undefined,
          location_city: companyData.locationCity || undefined,
          location_state: companyData.locationState || undefined,
          location_country: companyData.locationCountry || undefined,
          brand_colors: brandColorsDict,
        });
      } else {
        try {
          const created = await createCompanyProfile({
            website_url: companyData.websiteUrl || undefined,
            logo_url: companyData.logoUrl || undefined,
            industry: companyData.industry || undefined,
            description: companyData.description || undefined,
            phone: companyData.phone || undefined,
            location_city: companyData.locationCity || undefined,
            location_state: companyData.locationState || undefined,
            location_country: companyData.locationCountry || undefined,
            brand_colors: brandColorsDict,
          });
          setProfileId(created.id);
        } catch (err) {
          // 409 = profile already exists, fetch it
          if (err instanceof ApiError && err.status === 409) {
            const existing = await getCompanyProfileByOrg(orgId);
            setProfileId(existing.id);
          } else {
            throw err;
          }
        }
      }
      setCurrentStep(1);
    } catch {
      // Continue even if save fails
      setCurrentStep(1);
    } finally {
      setSaving(false);
    }
  };

  const handleEquipmentNext = async () => {
    if (orgId) {
      try {
        const eq = await getOrgEquipment(orgId);
        setEquipmentCount(eq.length);
        setOrgEquipmentIds(eq.map((e) => e.equipment_id));
      } catch {
        // ignore
      }
    }
    setCurrentStep(2);
  };

  const handleCapabilitiesNext = () => {
    if (orgId) {
      getOrgCapabilities(orgId)
        .then((caps) => setCapabilityCount(caps.length))
        .catch(() => {});
    }
    setCurrentStep(3);
  };

  const handleWizardComplete = async () => {
    if (profileId) {
      try {
        await updateCompanyProfile(profileId, { is_wizard_complete: true });
      } catch {
        // best effort
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-8">Get Started</h1>

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
                        ? 'bg-teak-dark text-white'
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

        {/* Step content */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 min-h-[300px]">
          {currentStep === 0 && (
            <CompanyProfileStep
              data={companyData}
              onUpdate={(partial) =>
                setCompanyData((prev) => ({ ...prev, ...partial }))
              }
              onNext={handleCompanyNext}
            />
          )}
          {currentStep === 1 && (
            <EquipmentStep
              onNext={handleEquipmentNext}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && (
            <CapabilitiesStep
              equipmentIds={orgEquipmentIds}
              onNext={handleCapabilitiesNext}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <PricingStep
              selectedApproach={pricingApproach}
              onSelect={setPricingApproach}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <PlanStep
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <CreatePortalStep
              companyName={companyData.companyName}
              equipmentCount={equipmentCount}
              capabilityCount={capabilityCount}
              onComplete={handleWizardComplete}
              onBack={() => setCurrentStep(4)}
            />
          )}
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Spinner className="h-4 w-4" /> Saving...
          </div>
        )}
      </div>
    </div>
  );
}
