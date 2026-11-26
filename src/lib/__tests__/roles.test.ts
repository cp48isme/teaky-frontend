import { describe, expect, it } from 'vitest';
import { landingForInvitation, PRODUCTION_LANDING, STAFF_LANDING } from '../roles';

// Ruling 26 Nov 2026 item 8(a) (RGI prep): an RGI admin or buyer lands on the
// RGI portal, never the production floor. A buyer-side role lands on its
// portal (ruling 17 Nov 2026); a staff role lands on /dashboard — the floor
// is one click away in the sidebar; the shadow_reader keeps the production
// screens, the only ones its grant reads.
describe('landingForInvitation', () => {
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
