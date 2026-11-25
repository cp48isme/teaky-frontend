import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession, setSession } from '../../api/client';
import {
  fetchUploadObjectUrl,
  isUploadUrl,
  storefrontAssetUrl,
  uploadApiPath,
  uploadDisplayName,
  uploadName,
  UploadUnavailableError,
} from '../uploads';

// Backend #320 (ruling 25 Nov 2026): the API still names uploads
// `/uploads/<name>`; the storefront reads them through the public asset
// route and every signed-in page through the bearer. The helper decides which.

const HEX = 'a'.repeat(32);
const HEX2 = 'b'.repeat(32);
const HEX3 = 'c'.repeat(32);

describe('uploadName', () => {
  it('takes the object name out of a relative upload URL', () => {
    expect(uploadName('/uploads/abc_logo.png')).toBe('abc_logo.png');
  });

  it('takes it out of an absolute one too (the production shell mark is EMAIL_BASE_URL + /uploads/…)', () => {
    expect(uploadName('https://app.example/uploads/abc_logo.png')).toBe('abc_logo.png');
    expect(uploadName('https://app.example/uploads/abc_logo.png?x=1#y')).toBe('abc_logo.png');
  });

  it('is null for anything that is not one flat upload name', () => {
    expect(uploadName(null)).toBeNull();
    expect(uploadName(undefined)).toBeNull();
    expect(uploadName('')).toBeNull();
    expect(uploadName('/uploads/')).toBeNull();
    expect(uploadName('/uploads/folder/name.png')).toBeNull();
    expect(uploadName('/uploads/.hidden')).toBeNull();
    expect(uploadName('https://client.example/logo.png')).toBeNull();
    expect(uploadName('data:image/png;base64,AAAA')).toBeNull();
    expect(uploadName('blob:http://localhost/1234')).toBeNull();
    expect(uploadName('/api/uploads/x.png')).toBeNull();
    expect(isUploadUrl('/uploads/x.png')).toBe(true);
    expect(isUploadUrl('/logo.png')).toBe(false);
  });
});

describe('storefrontAssetUrl', () => {
  it('builds the public asset route under the API base for an upload', () => {
    expect(storefrontAssetUrl('raphael', '/uploads/abc_mockup.png')).toBe('/api/p/raphael/assets/abc_mockup.png');
  });

  it('leaves a URL that is not an upload exactly as it was', () => {
    expect(storefrontAssetUrl('raphael', 'https://client.example/logo.png')).toBe('https://client.example/logo.png');
    expect(storefrontAssetUrl('raphael', '/static/placeholder.png')).toBe('/static/placeholder.png');
  });

  it('encodes the slug and the name as path segments', () => {
    expect(storefrontAssetUrl('a b', '/uploads/x y.png')).toBe('/api/p/a%20b/assets/x%20y.png');
  });
});

describe('uploadApiPath', () => {
  it('is the bearer route for one object name', () => {
    expect(uploadApiPath('abc_logo.png')).toBe('/uploads/abc_logo.png');
  });
});

// The stored shape (backend #320 at fa89727, `_unique_object_name` +
// `owned_filename`, parsed by `owner_of` with
// `^[0-9a-f]{32}_o([0-9a-f]{32})u([0-9a-f]{32})_`): the unique prefix first,
// then the owner tag, then the filename. Older objects have no tag.
describe('uploadDisplayName', () => {
  it('strips the unique prefix and then the owner tag of a tagged object name (uuid first, then the tag)', () => {
    expect(uploadDisplayName(`/uploads/${HEX3}_o${HEX}u${HEX2}_artwork final.pdf`)).toBe('artwork final.pdf');
    expect(uploadDisplayName(`${HEX3}_o${HEX}u${HEX2}_mark.png`)).toBe('mark.png');
  });

  it('strips only the unique prefix of an older, untagged object name', () => {
    expect(uploadDisplayName(`/uploads/${HEX3}_mark.png`)).toBe('mark.png');
    expect(uploadDisplayName(`${HEX3}_mark.png`)).toBe('mark.png');
  });

  it('shows a name with no recognisable prefix whole', () => {
    expect(uploadDisplayName('/uploads/mark.png')).toBe('mark.png');
    expect(uploadDisplayName('/uploads/abc_mark.png')).toBe('abc_mark.png');
    expect(uploadDisplayName('https://client.example/logo.png')).toBe('https://client.example/logo.png');
  });
});

describe('fetchUploadObjectUrl', () => {
  const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();
  const createObjectURL = vi.fn(() => 'blob:test-object');

  beforeEach(() => {
    fetchMock.mockReset();
    createObjectURL.mockClear();
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true, writable: true });
    setSession({ access_token: 'access.token', token_type: 'bearer', expires_in: 900 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearSession();
  });

  it('GETs the bearer route under the API base with the token and makes an object URL of the bytes', async () => {
    fetchMock.mockResolvedValueOnce(new Response(new Blob(['png']), { status: 200 }));
    const made = await fetchUploadObjectUrl('/uploads/abc_logo.png');
    expect(made).toBe('blob:test-object');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/uploads/abc_logo.png');
    expect((init?.headers as Record<string, string>)['Authorization']).toBe('Bearer access.token');
    expect(init?.credentials).toBe('include');
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });

  it('refuses a URL that is not an upload without a request', async () => {
    await expect(fetchUploadObjectUrl('https://client.example/logo.png')).rejects.toThrow(/Not an upload URL/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws UploadUnavailableError with the status when the read is refused', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    await expect(fetchUploadObjectUrl('/uploads/abc_logo.png')).rejects.toBeInstanceOf(UploadUnavailableError);
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
