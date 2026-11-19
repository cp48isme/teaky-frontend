import { Link } from 'react-router-dom';
import Markdown from '../components/Markdown';
import SiteFooter from '../components/layout/SiteFooter';
import privacy from '../content/privacy.md?raw';
import terms from '../content/terms.md?raw';
import contact from '../content/contact.md?raw';

/** /privacy, /terms, /contact (t02, 18 Nov 2026): the content files rendered;
 * Clayton edits the markdown, the next build ships it. */
const SOURCES = { privacy, terms, contact } as const;

export default function ContentPage({ page }: { page: keyof typeof SOURCES }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <p className="mb-6 text-sm">
          <Link to="/" className="font-medium text-teak-dark transition hover:text-teak">← Teaky</Link>
        </p>
        <Markdown source={SOURCES[page]} />
      </div>
      <SiteFooter />
    </div>
  );
}
