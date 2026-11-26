import { describe, expect, it } from 'vitest';
import { hasFloorRole, isShadowReader, landingForInvitation, PRODUCTION_LANDING, STAFF_LANDING } from '../roles';

// Ruling 26 Nov 2026 item 4: the server decides the landing (GET /auth/me
// `home`); this local rule is the fallback for a server that does not carry
// it. Item 8(a) (RGI prep): an RGI admin or buyer lands on the RGI portal,
// never the production floor. A buyer-side role lands on its portal (ruling
// 17 Nov 2026); a staff role lands on /dashboard; the shadow_reader keeps the
// production screens, the only ones its grant reads.
describe('landingForInvitation (the fallback when the server has not said)', () => {
  it('a printer_admin of a shop with no production (RGI: no portal on the invite) lands on /dashboard, not the floor', () => {
    expect(landingForInvitation('printer_admin', null)).toBe('/dashboard');
    expect(landingForInvitation('printer_admin', null)).toBe(STAFF_LANDING);
    expect(landingForInvitation('printer_admin', null)).not.toBe(PRODUCTION_LANDING);
  });

  it('staff with a portal attached still land on /dashboard, never the portal and never the floor', () => {
    expect(landingForInvitation('printer_admin', 'raphael')).toBe('/dashboard');
    expect(landingForInvitation('sales_rep', 'raphael')).toBe('/dashboard');
    expect(landingForInvitation('sales_team_lead', null)).toBe('/dashboard');
  });

  it('a buyer lands on the invited portal', () => {
    expect(landingForInvitation('end_user', 'raphael')).toBe('/p/raphael');
    expect(landingForInvitation('portal_admin', 'raphael')).toBe('/p/raphael');
    expect(landingForInvitation('sub_portal_admin', 'raphael')).toBe('/p/raphael');
    expect(landingForInvitation('portal_admin', null)).toBe('/');
  });

  it('the shadow_reader keeps the production screens (ruling 17 Nov 2026)', () => {
    expect(landingForInvitation('shadow_reader', 'sandbox-hotel')).toBe('/production/batches');
    expect(landingForInvitation('shadow_reader', null)).toBe(PRODUCTION_LANDING);
  });
});

// Ruling 26 Nov 2026 item 4: the floor set is exactly the roles that hold
// order:release or production:shadow_read in the backend's permissions.py.
// sales_rep, sales_team_lead and store_creator hold neither; the frontend's
// list said they did, and they landed on a floor that answered 403.
describe('hasFloorRole mirrors the permission model', () => {
  it('printer_admin, super_admin and the shadow_reader have a floor grant', () => {
    expect(hasFloorRole(['printer_admin'])).toBe(true);
    expect(hasFloorRole(['super_admin'])).toBe(true);
    expect(hasFloorRole(['shadow_reader'])).toBe(true);
  });

  it('sales_rep, sales_team_lead, store_creator and billing_contact do not — nor does any buyer', () => {
    for (const role of ['sales_rep', 'sales_team_lead', 'store_creator', 'billing_contact', 'end_user', 'portal_admin', 'sub_portal_admin']) {
      expect(hasFloorRole([role]), role).toBe(false);
    }
    expect(hasFloorRole([])).toBe(false);
  });

  it('a shadow_reader who also holds a sales role is still the read-only reader (no acting role)', () => {
    expect(isShadowReader(['shadow_reader', 'sales_rep'])).toBe(true);
    expect(isShadowReader(['shadow_reader', 'printer_admin'])).toBe(false);
  });
});
