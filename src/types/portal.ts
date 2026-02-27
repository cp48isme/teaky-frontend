export interface BrandConfig {
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  banner_image_url: string | null;
  powered_by_teaky: boolean;
}

export interface Portal {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  type: string;
  status: string;
  brand_config: BrandConfig | null;
  created_via: string;
  approval_workflow: string;
  require_po: boolean;
  self_registration: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePortalRequest {
  name: string;
  slug: string;
  type?: string;
  brand_config?: BrandConfig;
  created_via?: string;
}

export interface UpdatePortalRequest {
  name?: string;
  slug?: string;
  status?: string;
  brand_config?: BrandConfig;
  approval_workflow?: string;
  require_po?: boolean;
  self_registration?: boolean;
}

export interface PublicPortalResponse {
  name: string;
  slug: string;
  brand_config: BrandConfig | null;
  type: string;
  status: string;
}
