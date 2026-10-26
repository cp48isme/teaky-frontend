import type { LineItem } from '../types/order';
/**
 * One true sentence per line about its artwork, from what the buyer declared
 * (never inferred from the proof flag): a new proof goes to the proof address;
 * a reprint repeats the last approved art without a proof; a product with no
 * artwork needs neither. Walkthrough finding N1 (2026-10-08): the old copy
 * called every non-proof line "a reprint of artwork already approved", which
 * was false for no-artwork products and for a first order.
 */
/**
 * The same declaration for the printer's order page, in order-entry terms: it
 * is the field that decides whether the job is proofed before press (13 Oct 2026).
 */
export function staffArtworkLine(li: LineItem): string {
  switch (li.artwork_disposition) {
    case 'changes_new_proof':
      return 'ART CHANGES — new proof required before press';
    case 'reuse_unchanged':
      return 'Exact reprint of the approved art — no proof';
    case 'no_artwork':
    default:
      return 'No artwork — no proof';
  }
}

export function artworkSentence(li: LineItem, proofEmail: string | null): string {
  const name = li.product_name;
  switch (li.artwork_disposition) {
    case 'changes_new_proof':
      // Ruling 2026-10-21 (A1): the proof loop runs through Single Source
      // Concierge — the buyer does not approve in the portal. Say what is true.
      return `${name}: you asked for changes, so a proof will come from Single Source Concierge${
        proofEmail ? ` (sent to ${proofEmail})` : ''
      }. Nothing prints until it is approved.`;
    case 'reuse_unchanged':
      return `${name}: you asked for an exact reprint of the artwork you approved last time, so no new proof is sent. It goes straight to the printer.`;
    case 'no_artwork':
    default:
      return `${name}: no artwork is involved, so no proof is needed. It goes straight to the printer as ordered.`;
  }
}
