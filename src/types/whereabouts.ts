/** Where did this order go (backend item 2, dispatch 17–18 Nov 2026):
 * `GET /orders/{order_id}/whereabouts`. Shapes mirror
 * `models/schemas/whereabouts.py`. */

export interface ScanEvent {
  at: string;
  scan: string;
  position: number;
  step: string;
  scanned_by: string;
  station: string;
}

export interface UnitLocation {
  state: 'none' | 'at' | 'out' | 'next' | 'done' | string;
  position: number | null;
  step: string;
  since: string | null;
}

export interface WhereaboutsHold {
  reason: string;
  detail: string | null;
  opened_at: string;
  cleared_at: string | null;
  cleared_how: string | null;
}

export interface WhereaboutsUnit {
  unit_id: string;
  kind: string;
  reference: string;
  formation: string;
  ordinal: number;
  release_state: string | null;
  scan_code: string;
  docket_number: string | null;
  business_entity: string;
  pushed_at: string | null;
  cancelled_at: string | null;
  line_item_ids: string[];
  location: UnitLocation;
  scans: ScanEvent[];
  holds: WhereaboutsHold[];
}

export interface WhereaboutsLine {
  line_item_id: string;
  line_no: number;
  product: string;
  quantity: number;
  pack_size: number;
  cards: number;
  scan_code: string;
  shipment_unit_id: string | null;
  production_unit_id: string | null;
  art_source: string;
}

export interface WhereaboutsPush {
  unit_id: string;
  at: string;
  by: string;
  outcome: string;
  docket_number: string | null;
}

export interface OrderShipment {
  shipped_at: string;
  tracking: string;
  carrier: string;
}

export interface OrderWhereabouts {
  order_id: string;
  order_ref: string;
  order_number: string;
  channel: string;
  customer: string;
  business_entity: string;
  placed_at: string;
  status: string;
  release_state: string | null;
  tags: string[];
  lines: WhereaboutsLine[];
  units: WhereaboutsUnit[];
  pushes: WhereaboutsPush[];
  shipped: OrderShipment | null;
  last_scan: ScanEvent | null;
  waiting_on: string[];
}
