import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { useStatus } from './useStatus';

// useAction(label, fn): the wrapper every mutation goes through (30 Oct 2026,
// ruling R1). On failure the region gets the server's detail — the cap
// sentence, the 409's reason, the 422's field — and on success it gets
// "<label> saved" unless the caller says what happened instead ("Added to your
// cart"). A failure never throws out of run(): it resolves undefined, so a
// handler reads `if (result === undefined) return;` instead of a try/catch
// that used to end in alert() or in nothing.

export interface ActionOptions<T> {
  /** What the region says on success. Default "<label> saved"; false to say nothing because the page shows the result itself. */
  success?: string | ((result: T) => string) | false;
}

export interface Action<A extends unknown[], T> {
  run: (...args: A) => Promise<T | undefined>;
  pending: boolean;
  /** The last run's failure text, for a form that also wants it inline; cleared when the next run starts. */
  error: string | null;
  clearError: () => void;
}

/** What the region says when `err` ended an action called `label`; null when nothing should be said. */
export function failureText(label: string, err: unknown): string | null {
  // The client is already taking the user to sign in; a message would vanish with the page.
  if (err instanceof Error && err.message === 'Session expired') return null;
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return `${label}: ${err.message}`;
  return `${label} failed`;
}

export function useAction<A extends unknown[], T>(
  label: string,
  fn: (...args: A) => Promise<T>,
  options: ActionOptions<T> = {},
): Action<A, T> {
  const { announce } = useStatus();
  const fnRef = useRef(fn);
  const optionsRef = useRef(options);
  useEffect(() => {
    fnRef.current = fn;
    optionsRef.current = options;
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: A): Promise<T | undefined> => {
      setPending(true);
      setError(null);
      try {
        const result = await fnRef.current(...args);
        const { success } = optionsRef.current;
        const text =
          success === false
            ? null
            : typeof success === 'function'
              ? success(result)
              : (success ?? `${label} saved`);
        if (text) announce('success', text);
        return result;
      } catch (err) {
        const text = failureText(label, err);
        if (text) {
          setError(text);
          announce('error', text);
        }
        return undefined;
      } finally {
        setPending(false);
      }
    },
    [label, announce],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, pending, error, clearError };
}
