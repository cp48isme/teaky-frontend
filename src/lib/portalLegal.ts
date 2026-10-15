/**
 * Portal legal pages: /p/{slug}/privacy and /p/{slug}/terms.
 *
 * Routed per portal from the start; the content is one shared default for now
 * (operator dispatch 2026-10-09). The second printer gets its own text through
 * BY_SLUG without re-plumbing. The default is placeholder content only — the
 * real notice and terms are drafts that Single Source Concierge (formerly RGI Publications,
 * rebranded 2026-10-15) has not seen (bead printer-agent2-71le)
 * and nothing here reads as a commitment.
 */

export type LegalKind = 'privacy' | 'terms';

export interface LegalPage {
  title: string;
  paragraphs: string[];
  contact: string;
  updated: string;
}

/** Blanks the operator supplies; until then the placeholders are shown verbatim. */
export const LEGAL_CONTACT = '[Single Source Concierge contact — operator to supply]';
export const LEGAL_UPDATED = '[date]';

const DEFAULT: Record<LegalKind, LegalPage> = {
  privacy: {
    title: 'Privacy notice',
    paragraphs: [
      'Single Source Concierge is preparing the privacy notice for this ordering portal. It will be published here.',
      'In the meantime, if you have a question about information held about you, contact',
    ],
    contact: LEGAL_CONTACT,
    updated: LEGAL_UPDATED,
  },
  terms: {
    title: 'Terms of use',
    paragraphs: [
      'Single Source Concierge is preparing the terms of use for this ordering portal. They will be published here.',
      "Your property's existing arrangements with Single Source Concierge continue to apply.",
      'Contact',
    ],
    contact: LEGAL_CONTACT,
    updated: LEGAL_UPDATED,
  },
};

/** Per-portal overrides, keyed by slug. Empty until a printer has its own text. */
const BY_SLUG: Record<string, Partial<Record<LegalKind, LegalPage>>> = {};

export function portalLegalPage(slug: string, kind: LegalKind): LegalPage {
  return BY_SLUG[slug]?.[kind] ?? DEFAULT[kind];
}

export function portalLegalPath(slug: string, kind: LegalKind): string {
  return `/p/${slug}/${kind}`;
}
