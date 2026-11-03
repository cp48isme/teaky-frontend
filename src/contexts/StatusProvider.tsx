import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { StatusContext, type StatusKind, type StatusMessage } from './status';

/** A success clears itself after this long; an error stays until dismissed or replaced. */
export const SUCCESS_VISIBLE_MS = 6000;

export default function StatusProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setMessage(null);
  }, []);

  const announce = useCallback((kind: StatusKind, text: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const next: StatusMessage = { id: nextId.current++, kind, text };
    setMessage(next);
    if (kind === 'success') {
      timer.current = setTimeout(() => {
        timer.current = null;
        setMessage((current) => (current?.id === next.id ? null : current));
      }, SUCCESS_VISIBLE_MS);
    }
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const api = useMemo(() => ({ message, announce, dismiss }), [message, announce, dismiss]);

  return (
    <StatusContext.Provider value={api}>
      {children}
      <StatusRegion message={message} onDismiss={dismiss} />
    </StatusContext.Provider>
  );
}

// The region is in the document from the first render, empty, so assistive
// technology has registered it before the first outcome lands in it.
function StatusRegion({ message, onDismiss }: { message: StatusMessage | null; onDismiss: () => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-testid="status-region"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      {message && (
        <div
          data-kind={message.kind}
          className={`pointer-events-auto flex max-w-xl items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg ${
            message.kind === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          <p className="flex-1">{message.text}</p>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="-mr-1 rounded px-1 leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
