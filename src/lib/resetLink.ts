/** The reset link's parts travel in the URL fragment (never sent to a server):
 *  the token, the address the email went to, and the portal that branded it. */
export function readResetFragment(hash: string): { token: string; email: string; portal: string } {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return { token: params.get('token') ?? '', email: params.get('email') ?? '', portal: params.get('portal') ?? '' };
}
