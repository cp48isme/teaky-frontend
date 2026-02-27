export interface Equipment {
  id: string;
  name: string;
  manufacturer: string | null;
  model_number: string | null;
  equipment_type: string;
  category: string | null;
  print_area_width: number | null;
  print_area_height: number | null;
  max_colors: number | null;
  specifications: Record<string, unknown> | null;
  is_custom: boolean;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrganizationEquipment {
  id: string;
  organization_id: string;
  equipment_id: string;
  quantity: number;
  notes: string | null;
  added_at: string;
}

export interface AddOrganizationEquipmentRequest {
  equipment_id: string;
  quantity?: number;
  notes?: string;
}
