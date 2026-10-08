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
