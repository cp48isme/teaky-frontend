/** The production side (day 2, 6 Nov 2026): what the Batches and
 * All Channel Orders screens read. Mirrors models/schemas/docket_send.py
 * and taylor_pull.py on the backend. */

export interface FillCandidateSummary {
  order_ref: string;
  channel: string;
  stock: string;
  slots: number;
  age_seconds: number;
  line_item_ids: string[];
}

export interface BatchSummary {
  unit_id: string;
  batch_number: number;
  stock: string;
  channel: string;
  used: number;
  capacity: number;
  blanks: number;
  full: boolean;
  orders: number;
  lines: number;
  channels: string[];
  oldest_line_ref: string | null;
  oldest_line_age_seconds: number | null;
  release_state: string | null;
  docket_number: string | null;
  released_at: string | null;
  released_by_id: string | null;
  cancelled: boolean;
  fill_candidates: FillCandidateSummary[];
  fillable_slots: number;
  line_item_ids: string[];
}

export interface PushOutFile {
  kind: string;
  filename: string;
  sha256: string;
  size_bytes: number;
}

export interface DocketPayloadView {
  service_name: string;
  service_transaction_id: string;
  service_url: string;
  customer_id: string;
  customer_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  order_id: string;
  order_date: string;
  order_name: string;
  item_code: string;
  item_name: string;
  quantity: number;
  item_total: string;
  description: string;
  pos: string[];
  cards: number;
}

export interface PushOutPreview {
  unit_id: string;
  batch_number: number;
  stock: string;
  used: number;
  capacity: number;
  blanks: number;
  orders: number;
  lines: number;
  docket_send_enabled: boolean;
  docket_host: string | null;
  existing_docket_number: string | null;
  payload: DocketPayloadView | null;
  payload_xml: string | null;
  payload_sha256: string | null;
  payload_problem: string | null;
  files: PushOutFile[];
}

export interface PushOutResult {
  unit_id: string;
  attempted_at: string;
  sent: boolean;
  docket_send_enabled: boolean;
  docket_number: string | null;
  needs_human: boolean;
  reason: string | null;
  release_state: string | null;
  payload_sha256: string | null;
}

export interface TaylorPoolLine {
  id: string;
  po: string;
  line_no: number;
  product: string;
  quantity: number;
  pack: number;
  cards: number;
  source_created_at: string;
  received_at: string;
  art_state: 'missing' | 'fetched' | 'hold';
  art_error: string | null;
  held_by: string[];
  stock: string;
}
