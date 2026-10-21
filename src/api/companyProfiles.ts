import { ApiError, apiRequest } from './client';
import type {
  CompanyProfile,
  CreateCompanyProfileRequest,
  UpdateCompanyProfileRequest,
} from '../types/companyProfile';

export async function createCompanyProfile(
  data: CreateCompanyProfileRequest,
): Promise<CompanyProfile> {
  return apiRequest<CompanyProfile>('/company-profiles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCompanyProfileByOrg(
  orgId: string,
): Promise<CompanyProfile> {
  // The server answers 200 with an empty body when the organisation has no
  // profile (ruling 2026-10-21) — no network 404 in the console on every
  // dashboard load. Callers keep their 'missing = rejection' contract.
  const profile = await apiRequest<CompanyProfile | null>(
    `/company-profiles/by-organization/${orgId}`,
  );
  if (profile === null) throw new ApiError(404, 'No company profile for this organization');
  return profile;
}

export async function updateCompanyProfile(
  profileId: string,
  data: UpdateCompanyProfileRequest,
): Promise<CompanyProfile> {
  return apiRequest<CompanyProfile>(`/company-profiles/${profileId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
