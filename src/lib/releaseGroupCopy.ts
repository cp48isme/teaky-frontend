/**
 * What the buyer is told, per shipment group, when an order was split
 * (H v3 §6, ruling 7). Never the words held or released: what goes now, what
 * waits for a proof, and that each group ships and is invoiced separately
 * with its own freight. Production jobs are RGI's and never appear here.
 */
import type { LineItem, Order } from "../types/order";
import type { ReleaseUnit } from "../types/releaseUnit";

export interface GroupSentence {
  unitId: string;
  heading: string;
  lines: string;
  note: string | null;
}

function liveUnits(order: Pick<Order, "release_units">): ReleaseUnit[] {
  return (order.release_units ?? [])
    .filter((u) => u.kind === "shipment" && !u.cancelled_at)
    .sort((a, b) => a.ordinal - b.ordinal);
}

/** Null when the order has one group or none: the per-line sentences stand. */
export function groupSentences(
  order: Pick<Order, "release_units" | "line_items" | "order_number">,
  supportName: string | null,
): { groups: GroupSentence[]; invoiceNote: string } | null {
  const units = liveUnits(order);
  if (units.length <= 1) return null;
  const byLine = new Map(order.line_items.map((li) => [li.id, li]));
  const groups = units.map((unit) => {
    const lines = unit.line_item_ids
      .map((id) => byLine.get(id))
      .filter((li): li is LineItem => Boolean(li));
    const count = lines.reduce((n, li) => n + li.quantity, 0);
    const names = lines
      .map((li) => `${li.product_name} ×${li.quantity}`)
      .join(", ");
    const waiting =
      unit.release_state !== null && unit.holds.some((h) => !h.cleared_at);
    return waiting
      ? {
          unitId: unit.id,
          heading: `${count} item${count === 1 ? "" : "s"} wait for your proof.`,
          lines: names,
          note: `A proof will come${supportName ? ` from ${supportName}` : ""}; nothing in this group prints until you approve it.`,
        }
      : {
          unitId: unit.id,
          heading: `${count} item${count === 1 ? "" : "s"} go to the printer now.`,
          lines: names,
          note: null,
        };
  });
  return {
    groups,
    invoiceNote: `These groups ship and are invoiced separately, each with its own freight charge. Each invoice will show your order number ${order.order_number} with a suffix (${units.map((u) => u.reference.replace(order.order_number, "")).join(", ")}).`,
  };
}
