import { describe, expect, it } from 'vitest';
import { LEGAL_CONTACT, LEGAL_UPDATED, portalLegalPage, portalLegalPath } from '../portalLegal';

describe('portal legal pages (placeholder content, routed per portal)', () => {
  it('routes per portal', () => {
    expect(portalLegalPath('raphael', 'privacy')).toBe('/p/raphael/privacy');
    expect(portalLegalPath('allegretto', 'terms')).toBe('/p/allegretto/terms');
  });

  it('serves the shared default for any slug until a printer has its own text', () => {
    expect(portalLegalPage('raphael', 'privacy')).toEqual(portalLegalPage('allegretto', 'privacy'));
  });

  it('says it is being prepared and makes no commitment', () => {
    const privacy = portalLegalPage('raphael', 'privacy');
    const terms = portalLegalPage('raphael', 'terms');
    expect(privacy.title).toBe('Privacy notice');
    expect(privacy.paragraphs[0]).toBe(
      'RGI Publications is preparing the privacy notice for this ordering portal. It will be published here.',
    );
    expect(terms.title).toBe('Terms of use');
    expect(terms.paragraphs).toContain("Your property's existing arrangements with RGI continue to apply.");
    expect(privacy.contact).toBe(LEGAL_CONTACT);
    expect(privacy.updated).toBe(LEGAL_UPDATED);
    const all = [...privacy.paragraphs, ...terms.paragraphs].join(' ').toLowerCase();
    for (const word of ['retain', 'retention', 'cookie', 'liability', 'we collect', 'we share']) {
      expect(all).not.toContain(word);
    }
  });
});
