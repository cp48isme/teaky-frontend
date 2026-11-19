import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { reportBug } from '../api/bugReports';
import { uploadFile } from '../api/uploads';
import { ApiError, isAuthenticated } from '../api/client';
import AuthShell from '../components/auth/AuthShell';

/** /report-a-bug (t02, 18 Nov 2026): an in-app form — the page it is about
 * (pre-filled from where the person came from), what happened, an optional
 * screenshot — written as a record and emailed to Teaky by the server. A
 * visitor who is not signed in is sent to sign in first; nothing here is a
 * mailto. */
export default function ReportBugPage() {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? (typeof document !== 'undefined' && document.referrer ? document.referrer : '');
  const [pageUrl, setPageUrl] = useState(from);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signedIn = isAuthenticated();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      let screenshotUrl: string | null = null;
      if (file) screenshotUrl = (await uploadFile(file)).url;
      const made = await reportBug({ page_url: pageUrl || window.location.href, description, screenshot_url: screenshotUrl });
      setDone(made.id);
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : 'Could not send the report');
    } finally {
      setBusy(false);
    }
  };

  // The footer is AuthShell's (t07: it rendered twice here — the shell's and
  // the page's own; the page's is gone).
  return (
    <AuthShell title="Report a bug" subtitle="Tell Teaky what went wrong; it reaches a person">
          {!signedIn ? (
            <p className="mt-6 text-sm text-wood">
              Sign in first, so the report carries your shop and page.{' '}
              <Link to="/login?next=%2Freport-a-bug" className="font-medium text-teak-dark transition hover:text-teak">Sign in</Link>
            </p>
          ) : done ? (
            <div role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Thanks for the feedback. Your reference is {done.slice(0, 8)}; a person reads every one.
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={submit} data-testid="bug-report-form">
              {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <div>
                <label htmlFor="page" className="block text-sm font-medium text-brand-dark">Page</label>
                <input id="page" type="text" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} placeholder="the page it happened on" className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-dark">What happened</label>
                <textarea id="description" required minLength={10} maxLength={4000} rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you did, what you expected, what you saw" className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak" />
              </div>
              <div>
                <span className="block text-sm font-medium text-brand-dark">Screenshot (optional)</span>
                <div className="mt-1.5 flex items-center gap-3">
                  {/* t07: the native control styled as a button — the label is the
                      button (hover and pressed states), the input stays for the
                      keyboard and the screen reader (sr-only, not hidden). */}
                  <label
                    htmlFor="screenshot"
                    data-testid="choose-file"
                    className="inline-flex cursor-pointer select-none items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-brand-dark shadow-sm transition hover:border-teak hover:bg-brand-light active:bg-teak/10 active:shadow-none focus-within:ring-2 focus-within:ring-teak"
                  >
                    Choose a file
                    <input id="screenshot" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="sr-only" />
                  </label>
                  <span className="text-sm text-wood" data-testid="chosen-file">{file ? file.name : 'No file chosen'}</span>
                </div>
              </div>
              <button type="submit" disabled={busy} className="w-full rounded-lg bg-teak-dark py-2.5 text-sm font-semibold text-white shadow transition hover:bg-teak disabled:opacity-50">
                {busy ? 'Sending…' : 'Send the report'}
              </button>
            </form>
          )}
    </AuthShell>
  );
}
