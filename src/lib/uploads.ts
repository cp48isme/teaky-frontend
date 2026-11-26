import { API_BASE, authenticatedFetch } from '../api/client';

/**
 * Uploads after backend #320 (ruling 25 Nov 2026, rev 48 item 1). The API
 * keeps answering `/uploads/<name>` in its bodies (mockup_urls, brand
 * assets, order files, proofs, the company logo), but the bytes behind that
 * path now need either a signed-in caller — `GET /uploads/<name>` with the
 * bearer, which a bare `<img src>` or `<a href>` cannot send — or, for the
 * storefront, the public route `GET /p/<slug>/assets/<name>` that serves only
 * an active portal's product mockups, logo, banner and favicon. This module
 * turns a stored URL into one or the other; anything that is not an upload
 * URL (a brand-scan logo on the client's own site, a data: preview) passes
 * through untouched.
 */

const UPLOAD_PATH_PREFIX = '/uploads/';

/**
 * The object name of an upload URL, relative (`/uploads/<name>`) or absolute
 * (the production shell's mark is `EMAIL_BASE_URL + /uploads/<name>`), or
 * null for anything else. Folder-nested names (`/uploads/a/b`) are not one
 * object name and are null too: neither serving route takes a path.
 */
export function uploadName(url: string | null | undefined): string | null {
  if (!url) return null;
  let pathname = url;
  if (/^https?:\/\//i.test(url)) {
    try {
      pathname = new URL(url).pathname;
    } catch {
      return null;
    }
  }
  if (!pathname.startsWith(UPLOAD_PATH_PREFIX)) return null;
  const name = pathname.slice(UPLOAD_PATH_PREFIX.length).split(/[?#]/)[0] ?? '';
  if (!name || name.includes('/') || name.startsWith('.')) return null;
  return name;
}

/** `url` is an upload the API serves (`/uploads/<name>`). */
export function isUploadUrl(url: string | null | undefined): boolean {
  return uploadName(url) !== null;
}

/**
 * The storefront's public URL for an upload of the portal `slug`:
 * `/api/p/<slug>/assets/<name>`, the route that serves an active portal's
 * product mockups, logo, banner and favicon with no sign-in. A URL that is
 * not an upload is returned as it is.
 */
export function storefrontAssetUrl(slug: string, url: string): string {
  const name = uploadName(url);
  if (name === null) return url;
  return `${API_BASE}/p/${encodeURIComponent(slug)}/assets/${encodeURIComponent(name)}`;
}

/** The API path the signed-in reader fetches: `/uploads/<name>` under `API_BASE`. */
export function uploadApiPath(name: string): string {
  return `${UPLOAD_PATH_PREFIX}${encodeURIComponent(name)}`;
}

// The object name the backend stores (file_storage_service._unique_object_name
// and owned_filename, backend #320 at fa89727): `<32 hex>_` (the unique
// prefix), then for an upload through POST /uploads the owner tag
// `o<32 hex>u<32 hex>_`, then the filename the person gave with any slash
// made `_`. Older objects are `<32 hex>_<filename>` with no tag. The unique
// prefix is stripped first, then the tag if one follows, to show that
// filename; a name with neither is shown whole.
const UNIQUE_PREFIX = /^[0-9a-f]{32}_/;
const OWNER_TAG = /^o[0-9a-f]{32}u[0-9a-f]{32}_/;

/** The filename the person uploaded, out of a stored upload URL or object name. */
export function uploadDisplayName(urlOrName: string): string {
  const name = uploadName(urlOrName) ?? urlOrName;
  const unprefixed = name.replace(UNIQUE_PREFIX, '');
  const stripped = unprefixed.replace(OWNER_TAG, '');
  return stripped || name;
}

export class UploadUnavailableError extends Error {
  status: number;

  constructor(status: number, name: string) {
    super(`Upload ${name} is unavailable (${status})`);
    this.name = 'UploadUnavailableError';
    this.status = status;
  }
}

/**
 * The bytes of an upload, read as the signed-in session (bearer attached,
 * an expired session refreshed once). `url` must be an upload URL; anything
 * else throws, since there is nothing of ours to fetch.
 */
export async function fetchUploadBlob(url: string, signal?: AbortSignal): Promise<Blob> {
  const name = uploadName(url);
  if (name === null) throw new Error(`Not an upload URL: ${url}`);
  const init: RequestInit = signal ? { method: 'GET', signal } : { method: 'GET' };
  const response = await authenticatedFetch(uploadApiPath(name), init);
  if (!response.ok) throw new UploadUnavailableError(response.status, name);
  return response.blob();
}

/**
 * An object URL (`blob:`) for an upload, read through the signed-in session.
 * The caller owns it: `revokeUploadObjectUrl` when the image or link is done
 * with it (the hook and components here do so on unmount).
 */
export async function fetchUploadObjectUrl(url: string, signal?: AbortSignal): Promise<string> {
  const blob = await fetchUploadBlob(url, signal);
  return URL.createObjectURL(blob);
}

export function revokeUploadObjectUrl(objectUrl: string): void {
  URL.revokeObjectURL(objectUrl);
}
