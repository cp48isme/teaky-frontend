/** The caller's own organisation, as the app needs it after sign-in. */
export interface OrganizationMe {
  id: string;
  name: string;
  /**
   * Set up and run by Teaky on negotiated terms (RGI Publications is the first).
   * The self-serve surfaces — the Get Started wizard, the plan step, the
   * "create your first portal" prompt, equipment — stand down for it.
   */
  is_managed: boolean;
}

/** GET /organizations/me/shell (ruling 18 Nov 2026): what the production
 * shell shows for the signed-in organisation — its name and its mark, the
 * company profile's logo else Teaky's own. Readable by every production
 * reader, the shadow_reader included. */
export interface ProductionShell {
  organization_id: string;
  name: string;
  mark: { url: string; alt: string; source: 'shop_profile' | 'portal_brand' | 'teaky' };
}
