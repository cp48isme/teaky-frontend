import { signedInDisplayName, signedInEmail } from './portalSession';

/** Who is signed in, for the avatar menu (dispatch 19 Nov 2026): the display
 * name when a sign-in path knew it, else the email the person signed in with;
 * never the user id (the access token's `sub` is a UUID and used to be shown
 * as the "email"). Both come from the browser's own record of the sign-in. */
export interface SignedInIdentity {
  email: string | null;
  displayName: string | null;
}

export function signedInIdentity(): SignedInIdentity {
  return { email: signedInEmail(), displayName: signedInDisplayName() };
}

/** What the menu's name line says: the display name, else the email's local
 * part, else nothing (never a UUID). */
export function labelFor(identity: SignedInIdentity): string {
  if (identity.displayName) return identity.displayName;
  if (identity.email) return identity.email.split('@')[0] ?? '';
  return '';
}

/** Two letters for the avatar: the first letters of the first two words of
 * the display name ("Andrew Hanlin" → AH, "Andrew" → AN); from the email's
 * local part when there is no name ("front.desk" → FD, "andrew" → AN); "?"
 * when nothing is known. */
export function initialsFor(identity: SignedInIdentity): string {
  const name = identity.displayName?.trim();
  if (name) {
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return ((words[0]![0] ?? '') + (words[1]![0] ?? '')).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  const local = (identity.email ?? '').split('@')[0] ?? '';
  if (!local) return '?';
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return ((parts[0]![0] ?? '') + (parts[1]![0] ?? '')).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}
