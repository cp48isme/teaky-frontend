import { apiRequest } from "./client";
import type { Order } from "../types/order";
import type {
  HeldQueueEntry,
  HoldEvidence,
  ReleaseUnit,
} from "../types/releaseUnit";

/** Release units (H v2): the per-unit release machine for the order desk. */
export async function listHeldQueue(): Promise<HeldQueueEntry[]> {
  return apiRequest<HeldQueueEntry[]>("/release-units/queue");
}

export async function releaseUnit(unitId: string): Promise<ReleaseUnit> {
  return apiRequest<ReleaseUnit>(`/release-units/${unitId}/release`, {
    method: "POST",
  });
}

export async function linkUnit(
  unitId: string,
  dmOrderNumber: string,
): Promise<ReleaseUnit> {
  return apiRequest<ReleaseUnit>(`/release-units/${unitId}/link`, {
    method: "POST",
    body: JSON.stringify({ dm_order_number: dmOrderNumber }),
  });
}

export async function unitNotFound(unitId: string): Promise<ReleaseUnit> {
  return apiRequest<ReleaseUnit>(`/release-units/${unitId}/not-found`, {
    method: "POST",
  });
}

export async function clearUnitHold(
  unitId: string,
  holdId: string,
  evidence: HoldEvidence,
): Promise<ReleaseUnit> {
  return apiRequest<ReleaseUnit>(
    `/release-units/${unitId}/holds/${holdId}/clear`,
    {
      method: "POST",
      body: JSON.stringify(evidence),
    },
  );
}

export async function cancelHeldUnits(
  orderId: string,
  reason: string,
): Promise<Order> {
  return apiRequest<Order>(`/release-units/orders/${orderId}/cancel-held`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
