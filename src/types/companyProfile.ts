export interface BrandColors {
  primary?: string | null;
  secondary?: string | null;
  accent?: string | null;
  tertiary?: string | null;
  quaternary?: string | null;
}

export interface CompanyProfile {
  id: string;
  organization_id: string;
  website_url: string | null;
  logo_url: string | null;
  industry: string | null;
  description: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  postal_code: string | null;
  brand_colors: BrandColors | null;
  is_wizard_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyProfileRequest {
  website_url?: string;
  logo_url?: string;
  industry?: string;
  description?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  postal_code?: string;
  brand_colors?: BrandColors;
}

export interface UpdateCompanyProfileRequest {
  website_url?: string;
  logo_url?: string;
  industry?: string;
  description?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  postal_code?: string;
  brand_colors?: BrandColors;
  is_wizard_complete?: boolean;
}
