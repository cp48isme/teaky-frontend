import { useEffect, useRef, type ImgHTMLAttributes, type ReactNode } from 'react';
import { useUploadObjectUrl } from '../../hooks/useUploadObjectUrl';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  /** Shown while the upload is being read; nothing by default. */
  placeholder?: ReactNode;
  /** Called once when the upload cannot be read (404, network); the image then renders nothing. */
  onUnavailable?: () => void;
}

/**
 * An `<img>` for a URL the API may answer with `/uploads/<name>` (ruling 25
 * Nov 2026, backend #320): the upload is fetched as the signed-in session and
 * shown from an object URL that is revoked on unmount; any other URL is
 * rendered directly. Renders `placeholder` (default nothing) until the bytes
 * are in, and nothing when they cannot be read.
 */
export default function AuthedImage({ src, placeholder = null, onUnavailable, ...rest }: Props) {
  const { src: resolved, status } = useUploadObjectUrl(src);

  // onUnavailable is a notification, not an input: it fires once per failure,
  // whatever identity the caller's handler has on that render.
  const latestOnUnavailable = useRef(onUnavailable);
  useEffect(() => {
    latestOnUnavailable.current = onUnavailable;
  });
  useEffect(() => {
    if (status === 'error') latestOnUnavailable.current?.();
  }, [status]);

  if (status === 'error') return null;
  if (!resolved) return <>{placeholder}</>;
  return <img src={resolved} {...rest} />;
}
