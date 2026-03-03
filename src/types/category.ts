export interface Category {
  id: string;
  portal_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
  parent_id?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  sort_order?: number;
  parent_id?: string | null;
}
