import { apiRequest } from './client';

interface OnboardingResponse {
  url: string;
  account_id: string;
}

interface StripeStatusResponse {
  connected: boolean;
  charges_enabled: boolean;
  account_id: string | null;
}

export async function getOnboardingLink(): Promise<OnboardingResponse> {
  return apiRequest<OnboardingResponse>('/stripe/connect/onboarding', {
    method: 'POST',
  });
}

export async function getStripeStatus(): Promise<StripeStatusResponse> {
  return apiRequest<StripeStatusResponse>('/stripe/connect/status');
}
