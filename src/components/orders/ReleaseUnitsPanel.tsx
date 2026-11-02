import { useState } from "react";
import { useAction } from "../../hooks/useAction";
import {
  cancelHeldUnits,
  clearUnitHold,
  linkUnit,
  releaseUnit,
  unitNotFound,
} from "../../api/releaseUnits";
import type { Order } from "../../types/order";
import type { HoldEvidence, ReleaseUnit } from "../../types/releaseUnit";
import {
  clearedHoldSentence,
  holdSentence,
  numberProvenance,
  unitCanRelease,
  unitHeadline,
  unitNeedsHuman,
  unitStateLabel,
  unitTitle,
} from "../../lib/releaseUnitCopy";

interface Props {
  order: Order;
  units: ReleaseUnit[];
  onChanged: (order?: Order) => Promise<void> | void;
}

const TONES: Record<string, string> = {
  held_for_proof: "border-amber-300 bg-amber-50",
  releasing: "border-sky-300 bg-sky-50",
  released: "border-green-300 bg-green-50",
  retryable: "border-red-300 bg-red-50",
  needs_human: "border-purple-300 bg-purple-50",
  cancelled: "border-gray-300 bg-gray-100",
  sent: "border-gray-200 bg-white",
};

function toneOf(unit: ReleaseUnit): string {
  if (unit.cancelled_at) return TONES.cancelled;
  if (!unit.release_state) return TONES.sent;
  return TONES[unit.release_state] ?? TONES.sent;
}

/**
 * One card per release unit (H v2): its state, its holds, the actions that make
 * sense in that state, and what its DocketManager number is evidence of.
 */
export default function ReleaseUnitsPanel({ order, units, onChanged }: Props) {
  const [linkNumbers, setLinkNumbers] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState<Record<string, HoldEvidence>>({});
  const [cancelReason, setCancelReason] = useState("");

  const release = useAction("Release", (id: string) => releaseUnit(id), {
    success: "Group released to production",
  });
  const link = useAction(
    "DocketManager order number",
    (id: string, n: string) => linkUnit(id, n),
    {
      success: "DocketManager order number recorded as entered by you",
    },
  );
  const notFound = useAction("Release", (id: string) => unitNotFound(id), {
    success: "Recorded: not in DocketManager. The group can be released again.",
  });
  const clear = useAction(
    "Hold",
    (id: string, h: string, e: HoldEvidence) => clearUnitHold(id, h, e),
    {
      success: "Hold cleared; the evidence is on the record",
    },
  );
  const cancel = useAction(
    "Cancel held groups",
    (id: string, r: string) => cancelHeldUnits(id, r),
    {
      success: "Held groups cancelled",
    },
  );
  const busy =
    release.pending ||
    link.pending ||
    notFound.pending ||
    clear.pending ||
    cancel.pending;

  const liveUnits = units.filter((u) => !u.cancelled_at);
  const heldUnfrozen = liveUnits.filter(
    (u) => u.release_state === "held_for_proof" && !u.frozen_at,
  );
  const byLine = new Map(order.line_items.map((li) => [li.id, li]));

  return (
    <div className="space-y-3" data-testid="release-units">
      {units
        .slice()
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((unit) => {
          const openHolds = unit.holds.filter((h) => !h.cleared_at);
          const clearedLoudly = unit.holds
            .map(clearedHoldSentence)
            .filter(Boolean) as string[];
          const provenance = numberProvenance(unit);
          const lines = unit.line_item_ids
            .map((id) => byLine.get(id))
            .filter(Boolean);
          return (
            <div
              key={unit.id}
              className={`rounded-lg border p-4 space-y-3 ${toneOf(unit)}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium">{unitTitle(unit, units.length)}</h3>
                <span className="rounded-full border px-2 py-0.5 text-xs">
                  {unitStateLabel(unit)}
                </span>
              </div>
              {lines.length > 0 && (
                <p className="text-xs text-gray-600">
                  {lines
                    .map((li) => `${li!.product_name} ×${li!.quantity}`)
                    .join(", ")}
                  {units.length > 1 &&
                    ` · items $${unit.subtotal}, freight $${unit.freight}, tax $${unit.tax}`}
                </p>
              )}
              <p className="text-sm">{unitHeadline(unit)}</p>
              {provenance && (
                <p className="text-xs text-gray-700">{provenance}</p>
              )}
              {clearedLoudly.map((s) => (
                <p key={s} className="text-xs font-medium text-amber-800">
                  {s}
                </p>
              ))}
              {openHolds.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {openHolds.map((hold) => {
                    const ev = evidence[hold.id] ?? {
                      evidence_kind: "email",
                      evidence_note: "",
                    };
                    return (
                      <li key={hold.id} className="space-y-1">
                        <div>{holdSentence(hold)}</div>
                        {hold.reason === "awaiting_proof" &&
                          !unit.frozen_at && (
                            <div className="flex flex-wrap items-end gap-2">
                              <label className="text-xs">
                                Approved how
                                <select
                                  value={ev.evidence_kind}
                                  onChange={(e) =>
                                    setEvidence({
                                      ...evidence,
                                      [hold.id]: {
                                        ...ev,
                                        evidence_kind: e.target
                                          .value as HoldEvidence["evidence_kind"],
                                      },
                                    })
                                  }
                                  className="ml-1 rounded border border-gray-300 px-1 py-0.5 text-xs"
                                >
                                  <option value="email">by email</option>
                                  <option value="phone">by phone</option>
                                  <option value="in_person">in person</option>
                                  <option value="other">other</option>
                                </select>
                              </label>
                              <input
                                type="text"
                                value={ev.evidence_note}
                                onChange={(e) =>
                                  setEvidence({
                                    ...evidence,
                                    [hold.id]: {
                                      ...ev,
                                      evidence_note: e.target.value,
                                    },
                                  })
                                }
                                placeholder="who approved, and when"
                                className="rounded border border-gray-300 px-2 py-1 text-xs"
                              />
                              <button
                                onClick={async () => {
                                  const updated = await clear.run(
                                    unit.id,
                                    hold.id,
                                    ev,
                                  );
                                  if (updated) await onChanged();
                                }}
                                disabled={
                                  busy || ev.evidence_note.trim().length < 3
                                }
                                className="rounded border border-amber-700 px-2 py-1 text-xs text-amber-900 disabled:opacity-50"
                              >
                                Record the approval and clear this hold
                              </button>
                            </div>
                          )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {unitCanRelease(unit) && (
                <button
                  onClick={async () => {
                    const updated = await release.run(unit.id);
                    if (updated) await onChanged();
                  }}
                  disabled={busy}
                  className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
                >
                  {release.pending
                    ? "Releasing…"
                    : unit.release_state === "retryable"
                      ? "Release this group again"
                      : "Release this group to production"}
                </button>
              )}
              {unitNeedsHuman(unit) && (
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label className="block text-xs font-medium">
                      DocketManager order number
                    </label>
                    <input
                      type="text"
                      value={linkNumbers[unit.id] ?? ""}
                      onChange={(e) =>
                        setLinkNumbers({
                          ...linkNumbers,
                          [unit.id]: e.target.value,
                        })
                      }
                      placeholder="e.g. 85954"
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const updated = await link.run(
                        unit.id,
                        (linkNumbers[unit.id] ?? "").trim(),
                      );
                      if (updated) await onChanged();
                    }}
                    disabled={busy || !(linkNumbers[unit.id] ?? "").trim()}
                    className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
                  >
                    It is there — record the number
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        !confirm(
                          "You checked DocketManager and this group is not there? It can then be released again.",
                        )
                      )
                        return;
                      const updated = await notFound.run(unit.id);
                      if (updated) await onChanged();
                    }}
                    disabled={busy}
                    className="rounded border border-gray-400 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    It is not there
                  </button>
                </div>
              )}
            </div>
          );
        })}
      {heldUnfrozen.length > 0 && liveUnits.length > heldUnfrozen.length && (
        <div className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-300 p-3">
          <div className="grow">
            <label className="block text-xs font-medium">
              Cancel the held groups only (the released ones stay)
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="reason, recorded with your name"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </div>
          <button
            onClick={async () => {
              if (
                !confirm(
                  `Cancel ${heldUnfrozen.length} held group(s)? Released groups are not affected.`,
                )
              )
                return;
              const updated = await cancel.run(order.id, cancelReason.trim());
              if (updated) await onChanged(updated);
              setCancelReason("");
            }}
            disabled={busy || cancelReason.trim().length < 3}
            className="rounded border border-red-700 px-3 py-1.5 text-xs font-medium text-red-800 disabled:opacity-50"
          >
            Cancel held groups
          </button>
        </div>
      )}
    </div>
  );
}
