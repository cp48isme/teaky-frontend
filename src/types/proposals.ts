/** Action proposals (backend #259, rev 42): a production action — push a
 * short run, push an order alone, void an order, mark done — proposed by a
 * person with a reason, recorded with the facts present, applied only when a
 * person approves it. Shapes mirror `models/schemas/action_proposals.py`. */

export type ActionProposalKind = 'push_short_run' | 'push_alone' | 'void_order' | 'mark_done';
export type ActionProposalTarget = 'order' | 'release_unit';
export type ActionProposalStatus = 'proposed' | 'approved' | 'declined' | 'failed' | 'withdrawn';
export type PushAloneReason = 'rush' | 'stock' | 'finishing' | 'other';

/** a27 item 2 (ruling 20 Nov 2026): a line a short run on a full batch sends back to the pool. */
export interface MovedLineFact {
  line_item_id: string;
  order_id: string;
  order_ref: string;
  product: string;
  slots: number;
  source_created_at: string | null;
}

export interface ProposalUnitFact {
  unit_id: string;
  reference: string;
  kind: string;
  formation: string;
  release_state: string | null;
  pushed_out: boolean;
  docket_number: string | null;
  cancelled: boolean;
}

export interface ActionProposalFacts {
  captured_at: string;
  target_kind: ActionProposalTarget;
  target_id: string;
  reference: string;
  channel: string;
  customer: string;
  portal_id: string | null;
  business_entity_id: string | null;
  order_status: string;
  lines: number;
  cards: number;
  units: ProposalUnitFact[];
  stock: string;
  slots_used: number | null;
  capacity: number | null;
  half: boolean;
  open_holds: string[];
  /** a27 item 2: the lines that return to the pool on approval (empty when the batch fits the half). */
  lines_moving?: MovedLineFact[];
  slots_kept?: number | null;
}

export interface ActionProposal {
  id: string;
  organization_id: string;
  kind: ActionProposalKind;
  target_kind: ActionProposalTarget;
  target_id: string;
  reason: string;
  category: PushAloneReason | null;
  note: string;
  facts: ActionProposalFacts;
  status: ActionProposalStatus;
  proposed_by: string | null;
  proposed_at: string;
  decided_by: string | null;
  decided_at: string | null;
  decision_note: string;
  result: unknown | null;
  failure: string;
  decision_context_id: string | null;
}

export interface ProposeActionRequest {
  kind: ActionProposalKind;
  target_kind: ActionProposalTarget;
  target_id: string;
  reason: string;
  category?: PushAloneReason;
  note?: string;
}
