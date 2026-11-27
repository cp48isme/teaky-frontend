import type { BatchSummary } from './production';

/** The batch page's one read (overnight dispatch, 26 Nov 2026, item 1):
 * mirrors `models/schemas/batch_page.py` on the backend. */

export interface BatchPageLine {
  line_item_id: string;
  order_id: string;
  order_ref: string;
  customer: string;
  product: string;
  quantity: number;
  pack_size: number;
  cards: number;
  lane: string | null;
  art_files: number;
}

export interface BatchPageFile {
  kind: string;
  filename: string;
  sha256: string;
  size_bytes: number;
  generated_at: string;
}

export interface BatchPageAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user_id: string | null;
  details: Record<string, unknown> | null;
}

export interface BatchPage {
  summary: BatchSummary;
  lines: BatchPageLine[];
  job_ticket: BatchPageFile | null;
  sheet: BatchPageFile | null;
  lines_with_art: number;
  docket_send_enabled: boolean;
  docket_host: string | null;
  audit: BatchPageAuditEntry[];
}
