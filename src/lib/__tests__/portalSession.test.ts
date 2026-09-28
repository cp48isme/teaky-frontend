import { describe, it, expect } from 'vitest';
import { portalSlugFromPath, safeNextPath, isBuyerUser, isPrinterUser } from '../portalSession';

describe('portalSession helpers', () => {
  it('reads the portal slug out of a portal path', () => {
    expect(portalSlugFromPath('/p/raphael')).toBe('raphael');
    expect(portalSlugFromPath('/p/raphael/cart?x=1')).toBe('raphael');
    expect(portalSlugFromPath('/dashboard')).toBeNull();
    expect(portalSlugFromPath(null)).toBeNull();
  });

  it('only honours same-origin next paths', () => {
    expect(safeNextPath('/p/raphael')).toBe('/p/raphael');
    expect(safeNextPath('//evil.example')).toBeNull();
    expect(safeNextPath('https://evil.example')).toBeNull();
  });

  it('classifies roles', () => {
    expect(isBuyerUser(['end_user'])).toBe(true);
    expect(isPrinterUser(['end_user'])).toBe(false);
    expect(isPrinterUser(['printer_admin'])).toBe(true);
  });
});
