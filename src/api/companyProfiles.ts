import { apiRequest } from './client';
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
  return apiRequest<CompanyProfile>(
    `/company-profiles/by-organization/${orgId}`,
  );
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
