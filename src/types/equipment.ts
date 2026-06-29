// Equipment specifications — mirrors BE
// src/teaky_print_portal/models/schemas/equipment_specifications.py (lso.19).
//
// Discriminator note: BE has no `equipment_type` literal on the variants.
// The 27-value `equipment_type` enum on the wrapper (Equipment /
// CreateEquipmentRequest) dispatches to the correct variant via a BE
// model_validator(mode="before"). On the FE side this union is structural;
// no narrowing helpers are provided here because no FE consumer reads
// `equipment.specifications` today. Add them in a future PR alongside the
// first consumer that needs them.

export interface Resolution {
  horizontal_dpi: number;
  vertical_dpi: number;
  notes?: string | null;
}

export interface SpeedSqFtPerHour {
  typical?: number | null;
  draft?: number | null;
  quality?: number | null;
  production?: number | null;
}

interface BaseEquipmentSpec {
  typical_products: string[];
  supported_materials: string[];
  notes?: string | null;
  special_capabilities: string[];
  limitations: string[];
}

export interface PressSpec extends BaseEquipmentSpec {
  resolution_dpi?: Resolution | null;
  color_channels: string[];
  printheads?: string | null;
  monochrome?: boolean | null;
  duplex?: boolean | null;

  ink_type?: string | null;
  toner_type?: string | null;

  max_paper_weight_gsm?: number | null;
  max_paper_weight_common_name?: string | null;
  min_paper_weight_gsm?: number | null;
  min_paper_weight_common_name?: string | null;
  max_paper_weight_lb?: number | null;
  max_paper_weight_lb_common_name?: string | null;
  min_paper_weight_lb?: number | null;
  min_paper_weight_lb_common_name?: string | null;
  max_stock_thickness_mm?: number | null;

  speed_impressions_per_hour?: number | null;
  speed_ppm?: number | null;
  speed_sq_ft_per_hour?: SpeedSqFtPerHour | null;
  speed_notes?: string | null;
  duty_cycle_pages_per_month?: number | null;

  cutoff_mm?: number | null;
  cutoff_common_name?: string | null;
  web_speed_m_per_min?: number | null;
  web_speed_common_name?: string | null;
  drying?: string | null;
  media_type?: string | null;

  transfer_media?: string | null;
  requires_heat_press?: boolean | null;

  coating_type?: string | null;
  inline_coater?: boolean | null;

  envelope_capable?: boolean | null;
  envelope_sizes: string[];
}

export interface FinishingSpec extends BaseEquipmentSpec {
  feed_type?: string | null;
  fold_type?: string | null;
  fold_patterns: string[];
  buckle_plates?: number | null;

  max_sheet_width_mm?: number | null;
  max_sheet_width_common_name?: string | null;
  max_sheet_length_mm?: number | null;
  max_sheet_length_common_name?: string | null;
  max_web_width_mm?: number | null;
  max_web_width_common_name?: string | null;

  speed_sheets_per_hour?: number | null;
  speed_pieces_per_hour?: number | null;
  speed_notes?: string | null;

  inline_gluer?: boolean | null;
  glue_types: string[];

  adhesive_type?: string | null;

  pockets?: number | null;
}

export interface MailingSpec extends BaseEquipmentSpec {
  speed_pieces_per_hour?: number | null;
  speed_envelopes_per_hour?: number | null;
  speed_labels_per_minute?: number | null;
  speed_packages_per_minute?: number | null;
  speed_notes?: string | null;

  tab_type?: string | null;
  tabs_per_piece?: string | null;
  wafer_seal_capable?: boolean | null;

  wrap_material?: string | null;

  label_type?: string | null;

  pockets?: number | null;
  envelope_sizes: string[];
  intelligent_inserting?: boolean | null;

  resolution_dpi?: Resolution | null;
  ink_type?: string | null;
  inline?: boolean | null;
  print_swath_mm?: number | null;
  print_swath_common_name?: string | null;

  max_piece_size?: string | null;
  min_piece_size?: string | null;
}

export interface WideFormatSpec extends BaseEquipmentSpec {
  resolution_dpi?: Resolution | null;
  color_channels: string[];
  printheads?: string | null;
  ink_type?: string | null;
  curing?: string | null;
  media_type?: string | null;
  duplex?: boolean | null;

  max_substrate_thickness_mm?: number | null;
  max_substrate_thickness_common_name?: string | null;

  positional_accuracy_microns?: number | null;

  speed_sq_ft_per_hour?: SpeedSqFtPerHour | null;
  speed_sheets_per_hour?: number | null;
  speed_notes?: string | null;
}

export interface CuttingSpec extends BaseEquipmentSpec {
  tools: string[];
  vacuum_zones?: number | null;
  dual_beam?: boolean | null;
  max_simultaneous_tools?: number | null;

  max_material_thickness_mm?: number | null;
  max_material_thickness_extended_mm?: number | null;

  acceleration_g?: number | null;

  cutting_area_width_mm?: number | null;
  cutting_area_length_mm?: number | null;
  cutting_area_common_name?: string | null;

  mechanical_speed_mm_per_second?: number | null;
  working_speed_mm_per_second?: number | null;
  speed_mm_per_second?: number | null;

  positional_accuracy_microns?: number | null;
  repeatability_microns?: number | null;
}

export interface SpecialtyProductionSpec extends BaseEquipmentSpec {
  transfer_types: string[];
}

export interface BinderySpec extends BaseEquipmentSpec {
  binding_type?: string | null;
  cutting_widths_mm: number[];
  cutting_widths_common_name?: string | null;
  drive_type?: string | null;
}

// Stub variants — BE seed data has no populated records for these
// equipment_type enum values. Interfaces are defined for 1:1 BE-union
// fidelity and future-proofing; they're structurally identical to
// BaseEquipmentSpec today. When BE enrichment populates variant-specific
// fields, add them here.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FlexographicSpec extends BaseEquipmentSpec {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PrePressSpec extends BaseEquipmentSpec {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LaminatorSpec extends BaseEquipmentSpec {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UVCoatingSpec extends BaseEquipmentSpec {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FoilStampingSpec extends BaseEquipmentSpec {}

export type EquipmentSpec =
  | PressSpec
  | FinishingSpec
  | MailingSpec
  | WideFormatSpec
  | CuttingSpec
  | SpecialtyProductionSpec
  | BinderySpec
  | FlexographicSpec
  | PrePressSpec
  | LaminatorSpec
  | UVCoatingSpec
  | FoilStampingSpec;

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
  specifications: EquipmentSpec | null;
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
