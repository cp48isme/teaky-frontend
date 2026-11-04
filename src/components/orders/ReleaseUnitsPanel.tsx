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
import {
  LEAD_TIME_BANDS,
  type HoldResolution,
  type ReleaseUnit,
  type ReleaseUnitHold,
} from "../../types/releaseUnit";
import {
  clearedHoldSentence,
  holdSentence,
  numberProvenance,
  priorDecisionSentence,
  productionUnitsOf,
  unitCanRelease,
  unitHeadline,
  unitNeedsHuman,
  unitStateLabel,
  unitTitle,
} from "../../lib/releaseUnitCopy";
import { proofSummarySentence } from "../../lib/proofStatusCopy";

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

function defaultResolution(hold: ReleaseUnitHold): HoldResolution {
  return {
    evidence_kind: "email",
    evidence_note: "",
    answer:
      hold.reason === "lead_time_band_missing"
        ? (hold.prior_decision?.answer ?? "")
        : null,
  };
}

/**
 * One card per shipment group (H v3): its state, its holds (with the evidence
 * form, the answer where the hold has one, and what was decided last time),
 * the release action, and beneath it the production job(s) its lines went
 * into — with link / not-found on the job and what its DocketManager number
 * is evidence of.
 */
export default function ReleaseUnitsPanel({ order, units, onChanged }: Props) {
  const [linkNumbers, setLinkNumbers] = useState<Record<string, string>>({});
  const [resolutions, setResolutions] = useState<
    Record<string, HoldResolution>
  >({});
  const [cancelReason, setCancelReason] = useState("");

  const release = useAction("Release", (id: string) => releaseUnit(id), {
    success: "Released to production",
  });
  const link = useAction(
    "DocketManager order number",
    (id: string, n: string) => linkUnit(id, n),
    {
      success: "DocketManager order number recorded as entered by you",
    },
  );
  const notFound = useAction("Release", (id: string) => unitNotFound(id), {
    success: "Recorded: not in DocketManager. The job can be released again.",
  });
  const clear = useAction(
    "Hold",
    (id: string, h: string, r: HoldResolution) => clearUnitHold(id, h, r),
    {
      success: "Hold cleared; the decision and its evidence are on the record",
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

  const shipments = units
    .filter((u) => u.kind === "shipment")
    .sort((a, b) => a.ordinal - b.ordinal);
  const productions = units.filter((u) => u.kind === "production");
  const liveShipments = shipments.filter((u) => !u.cancelled_at);
  const heldUnfrozen = liveShipments.filter(
    (u) => u.release_state === "held_for_proof" && !u.frozen_at,
  );
  const byLine = new Map(order.line_items.map((li) => [li.id, li]));

  const holdForm = (unit: ReleaseUnit, hold: ReleaseUnitHold) => {
    const res = resolutions[hold.id] ?? defaultResolution(hold);
    const needsAnswer = hold.reason === "lead_time_band_missing";
    const canSubmit =
      res.evidence_note.trim().length >= 3 && (!needsAnswer || !!res.answer);
    const set = (patch: Partial<HoldResolution>) =>
      setResolutions({ ...resolutions, [hold.id]: { ...res, ...patch } });
    return (
      <div className="flex flex-wrap items-end gap-2">
        {needsAnswer && (
          <label className="text-xs">
            Lead time
            <select
              value={res.answer ?? ""}
              onChange={(e) => set({ answer: e.target.value })}
              className="ml-1 rounded border border-gray-300 px-1 py-0.5 text-xs"
            >
              <option value="">choose…</option>
              {LEAD_TIME_BANDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-xs">
          {hold.reason === "awaiting_proof" ? "Approved how" : "Decided how"}
          <select
            value={res.evidence_kind}
            onChange={(e) =>
              set({
                evidence_kind: e.target.value as HoldResolution["evidence_kind"],
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
          value={res.evidence_note}
          onChange={(e) => set({ evidence_note: e.target.value })}
          placeholder={
            hold.reason === "awaiting_proof"
              ? "who approved, and when"
              : "who decided, and on what"
          }
          className="rounded border border-gray-300 px-2 py-1 text-xs"
        />
        <button
          onClick={async () => {
            const updated = await clear.run(unit.id, hold.id, {
              ...res,
              answer: needsAnswer ? res.answer : null,
            });
            if (updated) await onChanged();
          }}
          disabled={busy || !canSubmit}
          className="rounded border border-amber-700 px-2 py-1 text-xs text-amber-900 disabled:opacity-50"
        >
          {hold.reason === "awaiting_proof"
            ? "Record the approval and clear this hold"
            : needsAnswer
              ? "Set the lead time and clear this hold"
              : "Record the decision and clear this hold"}
        </button>
      </div>
    );
  };

  const productionCard = (job: ReleaseUnit) => {
    const provenance = numberProvenance(job);
    return (
      <div
        key={job.id}
        className={`rounded border p-3 space-y-2 ${toneOf(job)}`}
        data-testid="production-unit"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-medium">{unitTitle(job, 1)}</h4>
          <span className="rounded-full border px-2 py-0.5 text-xs">
            {unitStateLabel(job)}
          </span>
        </div>
        <p className="text-sm">{unitHeadline(job)}</p>
        {provenance && <p className="text-xs text-gray-700">{provenance}</p>}
        {unitCanRelease(job) && (
          <button
            onClick={async () => {
              const updated = await release.run(job.id);
              if (updated) await onChanged(updated);
            }}
            disabled={busy}
            className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {release.pending ? "Releasing…" : "Release this job again"}
          </button>
        )}
        {unitNeedsHuman(job) && (
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="block text-xs font-medium">
                DocketManager order number
              </label>
              <input
                type="text"
                value={linkNumbers[job.id] ?? ""}
                onChange={(e) =>
                  setLinkNumbers({ ...linkNumbers, [job.id]: e.target.value })
                }
                placeholder="e.g. 85954"
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <button
              onClick={async () => {
                const updated = await link.run(
                  job.id,
                  (linkNumbers[job.id] ?? "").trim(),
                );
                if (updated) await onChanged();
              }}
              disabled={busy || !(linkNumbers[job.id] ?? "").trim()}
              className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              It is there — record the number
            </button>
            <button
              onClick={async () => {
                if (
                  !confirm(
                    "You checked DocketManager and this job is not there? It can then be released again.",
                  )
                )
                  return;
                const updated = await notFound.run(job.id);
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
  };

  return (
    <div className="space-y-3" data-testid="release-units">
      {shipments.map((unit) => {
        const openHolds = unit.holds.filter((h) => !h.cleared_at);
        const clearedLoudly = unit.holds
          .map(clearedHoldSentence)
          .filter(Boolean) as string[];
        const lines = unit.line_item_ids
          .map((id) => byLine.get(id))
          .filter(Boolean);
        const jobs = productionUnitsOf(unit, productions);
        return (
          <div
            key={unit.id}
            className={`rounded-lg border p-4 space-y-3 ${toneOf(unit)}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium">
                {unitTitle(unit, shipments.length)}
              </h3>
              <span className="rounded-full border px-2 py-0.5 text-xs">
                {unitStateLabel(unit)}
              </span>
            </div>
            {lines.length > 0 && (
              <p className="text-xs text-gray-600">
                {lines
                  .map((li) => `${li!.product_name} ×${li!.quantity}`)
                  .join(", ")}
                {shipments.length > 1 &&
                  ` · items $${unit.subtotal}, freight $${unit.freight}, tax $${unit.tax}`}
              </p>
            )}
            <p className="text-sm">{unitHeadline(unit)}</p>
            {proofSummarySentence(lines as Order["line_items"]) && (
              <p className="text-xs font-medium" data-testid="proof-summary">
                {proofSummarySentence(lines as Order["line_items"])}
              </p>
            )}
            {clearedLoudly.map((s) => (
              <p key={s} className="text-xs font-medium text-amber-800">
                {s}
              </p>
            ))}
            {openHolds.length > 0 && (
              <ul className="space-y-2 text-sm">
                {openHolds.map((hold) => {
                  const prior = priorDecisionSentence(hold);
                  return (
                    <li key={hold.id} className="space-y-1">
                      <div>{holdSentence(hold)}</div>
                      {prior && (
                        <div className="text-xs text-gray-700">{prior}</div>
                      )}
                      {!unit.frozen_at && holdForm(unit, hold)}
                    </li>
                  );
                })}
              </ul>
            )}
            {unitCanRelease(unit, productions) && (
              <button
                onClick={async () => {
                  const updated = await release.run(unit.id);
                  if (updated) await onChanged(updated);
                }}
                disabled={busy}
                className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
              >
                {release.pending
                  ? "Releasing…"
                  : "Release this group to production"}
              </button>
            )}
            {jobs.length > 0 && (
              <div className="space-y-2 pl-3 border-l-2 border-gray-300">
                {jobs.map(productionCard)}
              </div>
            )}
          </div>
        );
      })}
      {heldUnfrozen.length > 0 && liveShipments.length > heldUnfrozen.length && (
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
