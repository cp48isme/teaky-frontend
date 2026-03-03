export interface Proof {
  id: string;
  order_id: string;
  line_item_id: string;
  version: number;
  file_url: string | null;
  thumbnail_url: string | null;
  status: string;
  specs: Record<string, unknown> | null;
  submitted_by: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  signature_data: string | null;
  approved_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmitProofRequest {
  line_item_id: string;
  file_url: string;
  thumbnail_url?: string;
  specs?: Record<string, unknown>;
}

export interface ApproveProofRequest {
  signature_data?: string;
  approved_by_name?: string;
}

export interface RejectProofRequest {
  reason: string;
}
