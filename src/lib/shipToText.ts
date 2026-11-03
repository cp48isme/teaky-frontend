/**
 * The ship-to rules the server applies (ruling 2 Nov 2026), mirrored so the
 * checkout form says what is wrong before the order is sent. The server is
 * the authority; this is the same sentence a step earlier.
 */
export interface ShipToFields {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

const US_STATE_CODES = new Set(
  (
    "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT " +
    "NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC " +
    "PR VI GU AS MP AA AE AP"
  ).split(" "),
);
const US_ZIP = /^\d{5}(-\d{4})?$/;
const PO_BOX = /^\s*(p\.?\s*o\.?\s*box|post\s+office\s+box|pob)\b/i;

export const PO_BOX_RULE =
  "We cannot ship to a PO Box; every shipment goes by UPS.";
export const STATE_RULE = "State must be a two-letter US state code.";
export const ZIP_RULE = "ZIP must be 5 digits or ZIP+4.";
export const STREET_NEEDED_FOR_RATES =
  "Enter the street address to see shipping rates.";

const LABELS: Record<string, string> = {
  name: "Hotel or business name",
  line1: "Address line 1",
  city: "City",
  state: "State",
  postal_code: "ZIP code",
};

/** The first problem with a ship-to, as the sentence to show, or null when it is deliverable. */
export function shipToProblem(a: ShipToFields): string | null {
  for (const field of [
    "name",
    "line1",
    "city",
    "state",
    "postal_code",
  ] as const) {
    if (!(a[field] ?? "").trim()) return `${LABELS[field]} is required.`;
  }
  if ((a.name ?? "").trim().length > 120)
    return `${LABELS.name} must be 120 characters or fewer.`;
  for (const field of ["line1", "line2", "city"] as const) {
    if ((a[field] ?? "").trim().length > 100)
      return `${LABELS[field] ?? "Address line 2"} must be 100 characters or fewer.`;
  }
  const country = (a.country ?? "US").trim().toUpperCase();
  if (!["US", "USA", "UNITED STATES"].includes(country)) {
    return "We ship within the United States today.";
  }
  if (!US_STATE_CODES.has(a.state.trim().toUpperCase())) return STATE_RULE;
  if (!US_ZIP.test(a.postal_code.trim())) return ZIP_RULE;
  if (PO_BOX.test(a.line1) || PO_BOX.test(a.line2 ?? "")) return PO_BOX_RULE;
  return null;
}
