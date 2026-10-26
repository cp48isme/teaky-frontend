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
