import { Link } from 'react-router-dom';

/** The site footer (t02, 18 Nov 2026), on every page, signed in or not:
 * Privacy, Terms, Help (t11, 25 Nov 2026), Contact Teaky, Report a bug. */
export default function SiteFooter({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const link = tone === 'dark' ? 'text-gray-400 hover:text-white' : 'text-wood hover:text-teak-dark';
  return (
    <footer className={`px-6 py-4 text-center text-xs ${tone === 'dark' ? 'text-gray-500' : 'text-wood'}`} data-testid="site-footer">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1" aria-label="Site">
        <Link to="/privacy" className={`transition ${link}`}>Privacy</Link>
        <Link to="/terms" className={`transition ${link}`}>Terms</Link>
        <Link to="/help" className={`transition ${link}`}>Help</Link>
        <Link to="/contact" className={`transition ${link}`}>Contact Teaky</Link>
        <Link to="/report-a-bug" className={`transition ${link}`}>Report a bug</Link>
      </nav>
    </footer>
  );
}
