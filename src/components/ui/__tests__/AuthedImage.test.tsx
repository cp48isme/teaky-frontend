import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession, setSession } from '../../../api/client';
import AuthedImage from '../AuthedImage';

// Backend #320 (ruling 25 Nov 2026): a signed-in page's `<img>` of an upload
// cannot send the bearer, so AuthedImage reads the bytes through the
// authenticated client and shows an object URL, revoked on unmount.

const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();
const createObjectURL = vi.fn(() => 'blob:test-object');
const revokeObjectURL = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
  vi.stubGlobal('fetch', fetchMock);
  Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true, writable: true });
  Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true, writable: true });
  setSession({ access_token: 'access.token', token_type: 'bearer', expires_in: 900 });
});

afterEach(() => {
  vi.unstubAllGlobals();
  clearSession();
});

describe('AuthedImage', () => {
  it('fetches the upload with the bearer, shows the object URL, and revokes it on unmount', async () => {
    fetchMock.mockResolvedValueOnce(new Response('png', { status: 200 }));
    const { unmount } = render(<AuthedImage src="/uploads/abc_mark.png" alt="Shop logo" className="h-20" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const img = await screen.findByRole('img', { name: 'Shop logo' });
    expect(img).toHaveAttribute('src', 'blob:test-object');
    expect(img.className).toBe('h-20');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('/api/uploads/abc_mark.png');
    expect((init?.headers as Record<string, string>)['Authorization']).toBe('Bearer access.token');

    expect(revokeObjectURL).not.toHaveBeenCalled();
    unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-object');
  });

  it('renders a URL that is not an upload directly, with no request', () => {
    render(<AuthedImage src="https://client.example/logo.png" alt="Client logo" />);
    expect(screen.getByRole('img', { name: 'Client logo' })).toHaveAttribute('src', 'https://client.example/logo.png');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('renders the placeholder while reading and nothing once the read is refused, telling the caller', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 404 }));
    const onUnavailable = vi.fn();
    render(
      <AuthedImage src="/uploads/abc_gone.png" alt="Gone" placeholder={<span>loading</span>} onUnavailable={onUnavailable} />,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => expect(onUnavailable).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('loading')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
