// One line per person on a variable-data item: "Name (Title), email, phone" —
// each part only when present (rows written before 2026-10-26 carry name and
// title only). Mirrors the backend's IOR recipients line.
export interface RecipientLike {
  name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
}

export function recipientText(r: RecipientLike): string {
  const head = r.title ? `${r.name} (${r.title})` : r.name;
  return [head, r.email, r.phone].filter((part) => part && part.trim()).join(', ');
}

/** A plain-enough email shape for a form: something@something.tld. */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// A phone number must be dialable (30 Oct 2026, ruling R4): any format, at
// least seven digits, no letters outside an "ext"/"x" extension. Mirrors the
// server's rule in models/schemas/phone.py, which is the one that refuses.
const PHONE_SHAPE = /^[0-9+()\-.\s/]+(?:(?:ext\.?|extension|x|#)\s*[0-9]+)?$/i;
export const PHONE_RULE =
  'needs at least 7 digits, as 816-555-0101 or +44 20 7946 0958; letters are not a phone number';

export function looksLikePhone(value: string): boolean {
  const text = value.trim();
  if (text.length > 40 || !PHONE_SHAPE.test(text)) return false;
  const digits = (text.match(/[0-9]/g) ?? []).length;
  return digits >= 7 && digits <= 20;
}
