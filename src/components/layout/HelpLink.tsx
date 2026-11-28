import { Link } from 'react-router-dom';

/** The "?" in both headers (navigation 28 Nov 2026, kkqk 1a): one click to
 * the manual from anywhere a staff member stands. */
export default function HelpLink({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      to="/help"
      aria-label="Help"
      title="Help"
      data-testid="help-link"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base font-semibold transition ${onDark ? 'border-white/30 text-white/90 hover:bg-white/10' : 'border-gray-200 text-brand-dark hover:bg-gray-50'}`}
    >
      ?
    </Link>
  );
}
