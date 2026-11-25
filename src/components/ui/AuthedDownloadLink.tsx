import { useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { fetchUploadObjectUrl, revokeUploadObjectUrl, uploadDisplayName, uploadName } from '../../lib/uploads';

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  href: string;
  /** The filename a save gets; the uploaded filename (after the object-name prefix) by default. */
  filename?: string;
  /** `open` (default) shows the file in a new tab as the old `target="_blank"` did; `download` saves it. */
  mode?: 'open' | 'download';
  /** Called when the upload cannot be read (404, network, blocked tab). */
  onUnavailable?: (error: unknown) => void;
  children: ReactNode;
}

// The object URL has to outlive the navigation it was handed to; a minute is
// ample for a tab to load it and well short of leaking for the session.
const REVOKE_AFTER_MS = 60_000;

function saveBlob(objectUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = 'noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * A link to a file the API names by `/uploads/<name>` (ruling 25 Nov 2026,
 * backend #320): the click fetches the bytes as the signed-in session and
 * opens them in a tab (or saves them, `mode="download"`) from an object URL.
 * The tab is opened synchronously on the click, before the fetch, so a
 * popup blocker has no say; it is closed again if the read fails. A URL that
 * is not an upload is an ordinary link.
 */
export default function AuthedDownloadLink({
  href,
  filename,
  mode = 'open',
  onUnavailable,
  children,
  ...rest
}: Props) {
  const [busy, setBusy] = useState(false);
  const name = uploadName(href);

  if (name === null) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  const onClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const tab = mode === 'open' ? window.open('', '_blank') : null;
    try {
      const objectUrl = await fetchUploadObjectUrl(href);
      if (tab) {
        tab.location.href = objectUrl;
      } else {
        saveBlob(objectUrl, filename ?? uploadDisplayName(name));
      }
      window.setTimeout(() => revokeUploadObjectUrl(objectUrl), REVOKE_AFTER_MS);
    } catch (error) {
      tab?.close();
      onUnavailable?.(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <a href={href} onClick={onClick} aria-busy={busy || undefined} {...rest}>
      {children}
    </a>
  );
}
