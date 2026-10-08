import type { LineItem } from '../types/order';
/**
 * One true sentence per line about its artwork, from what the buyer declared
 * (never inferred from the proof flag): a new proof goes to the proof address;
 * a reprint repeats the last approved art without a proof; a product with no
 * artwork needs neither. Walkthrough finding N1 (2026-10-08): the old copy
 * called every non-proof line "a reprint of artwork already approved", which
 * was false for no-artwork products and for a first order.
 */
export function artworkSentence(li: LineItem, proofEmail: string | null): string {
  const name = li.product_name;
  switch (li.artwork_disposition) {
    case 'changes_new_proof':
      return `${name}: you asked for changes, so a new proof will be sent${
        proofEmail ? ` to ${proofEmail}` : ' to you'
      } for approval before anything is printed. Nothing goes to press until it is approved.`;
    case 'reuse_unchanged':
      return `${name}: you asked for an exact reprint of the artwork you approved last time, so no new proof is sent. It goes straight to the printer.`;
    case 'no_artwork':
    default:
      return `${name}: no artwork is involved, so no proof is needed. It goes straight to the printer as ordered.`;
  }
}
