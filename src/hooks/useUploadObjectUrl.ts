import { useEffect, useState } from 'react';
import { fetchUploadObjectUrl, revokeUploadObjectUrl, uploadName } from '../lib/uploads';

export type UploadObjectUrlStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface UploadObjectUrl {
  /** The URL to render: the object URL once read, the given URL when it is not an upload, else null. */
  src: string | null;
  status: UploadObjectUrlStatus;
}

/** What one read of an upload URL came to; kept with its URL so a stale result is never shown for a new one. */
interface ReadResult {
  forUrl: string;
  src: string | null;
  status: 'ready' | 'error';
}

/**
 * The renderable URL for `url` (ruling 25 Nov 2026, backend #320): an upload
 * is read through the signed-in session into an object URL, revoked when the
 * URL changes or the component unmounts; a URL that is not an upload (a
 * brand-scan logo on the client's site, a data: or blob: preview of a file
 * just picked) is handed back as it is, with no request.
 */
export function useUploadObjectUrl(url: string | null | undefined): UploadObjectUrl {
  const name = uploadName(url);
  const [result, setResult] = useState<ReadResult | null>(null);

  useEffect(() => {
    if (!url || name === null) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    fetchUploadObjectUrl(url, controller.signal)
      .then((made) => {
        if (controller.signal.aborted) {
          revokeUploadObjectUrl(made);
          return;
        }
        objectUrl = made;
        setResult({ forUrl: url, src: made, status: 'ready' });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ forUrl: url, src: null, status: 'error' });
      });
    return () => {
      controller.abort();
      if (objectUrl) revokeUploadObjectUrl(objectUrl);
    };
  }, [url, name]);

  if (!url) return { src: null, status: 'idle' };
  if (name === null) return { src: url, status: 'ready' };
  if (result && result.forUrl === url) return { src: result.src, status: result.status };
  return { src: null, status: 'loading' };
}
