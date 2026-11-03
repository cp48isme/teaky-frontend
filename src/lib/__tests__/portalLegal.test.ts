import { describe, expect, it } from 'vitest';
import { LEGAL_UPDATED, legalUpdatedLabel, portalLegalPage, portalLegalPath } from '../portalLegal';

// 30 Oct 2026: the real notice and terms, verbatim from the operator's
// dispatch, replace the "is preparing…" placeholders. A bracketed placeholder
// must never ship on a legal page again.

describe('portal legal pages', () => {
  it('routes per portal', () => {
    expect(portalLegalPath('raphael', 'privacy')).toBe('/p/raphael/privacy');
    expect(portalLegalPath('allegretto', 'terms')).toBe('/p/allegretto/terms');
  });

  it('serves the shared default for any slug until a second printer has its own text', () => {
    expect(portalLegalPage('raphael', 'privacy')).toEqual(portalLegalPage('allegretto', 'privacy'));
  });

  it('carries the published text, not a placeholder', () => {
    const privacy = portalLegalPage('raphael', 'privacy');
    const terms = portalLegalPage('raphael', 'terms');
    expect(privacy.title).toBe('Privacy notice');
    expect(terms.title).toBe('Terms of use');
    expect(privacy.sections[0]!.paragraphs[0]).toMatch(/^This portal is provided to you by Single Source RGI/);
    expect(privacy.sections.map((s) => s.heading)).toEqual([
      null,
      'What we collect.',
      'Why we collect it.',
      'Who sees it.',
      'How long we keep it.',
      'Your choices.',
      'Cookies.',
      'Questions.',
    ]);
    expect(terms.sections.map((s) => s.heading)).toEqual([
      'Who this is between.',
      'Your account.',
      'Placing an order.',
      'Artwork, and what your declaration means.',
      'Content you supply.',
      'Changing or cancelling.',
      'Availability.',
      'Limitation of liability.',
      'Governing law.',
    ]);
    expect(terms.sections.at(-1)!.paragraphs).toEqual(['Kansas, and the courts of Johnson County, Kansas.']);
    const all = [privacy, terms]
      .flatMap((p) => p.sections.flatMap((s) => [s.heading ?? '', ...s.paragraphs]))
      .join(' ');
    expect(all).not.toMatch(/\[[^\]]*\]/); // no "[operator to supply]"-style blanks
    expect(all).not.toContain('Single Source Concierge');
    expect(all).not.toContain('is preparing');
  });

  it('dates the text, never a placeholder', () => {
    expect(LEGAL_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(portalLegalPage('raphael', 'privacy').updated).toBe(LEGAL_UPDATED);
    expect(legalUpdatedLabel('2026-10-30')).toBe('30 October 2026');
  });
});
