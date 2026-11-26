import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import SiteFooter from '../components/layout/SiteFooter';
import floor from '../content/help/floor.md?raw';
import admin from '../content/help/admin.md?raw';
import hotelBuyer from '../content/help/hotel-buyer.md?raw';
import rgiAdmin from '../content/help/rgi-admin.md?raw';

/** /help and /help/:slug (t11, 25 Nov 2026): the user manual, one markdown
 * file per person, served the way /privacy and /terms are (ContentPage):
 * the file is rendered by src/lib/markdown.ts; Clayton edits the markdown,
 * the next build ships it. /help is the index of the four. */
const HELP_PAGES = {
  floor: { title: 'On the production floor', source: floor },
  admin: { title: 'Running the shop', source: admin },
  'hotel-buyer': { title: 'Ordering as a hotel buyer', source: hotelBuyer },
  'rgi-admin': { title: 'RGI admin: the day across the hotels', source: rgiAdmin },
} as const;

type HelpSlug = keyof typeof HELP_PAGES;

const HELP_SLUGS = Object.keys(HELP_PAGES) as HelpSlug[];

function isHelpSlug(value: string | undefined): value is HelpSlug {
  return value !== undefined && value in HELP_PAGES;
}

export default function HelpPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = isHelpSlug(slug) ? HELP_PAGES[slug] : null;
  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <p className="mb-6 text-sm">
          {page ? (
            <Link to="/help" className="font-medium text-teak-dark transition hover:text-teak">← Help</Link>
          ) : (
            <Link to="/" className="font-medium text-teak-dark transition hover:text-teak">← Teaky</Link>
          )}
        </p>
        {page ? (
          <Markdown source={page.source} />
        ) : (
          <div className="space-y-4 text-brand-dark" data-testid="help-index">
            <h1 className="font-heading text-2xl font-bold">Help</h1>
            {slug !== undefined ? (
              <p className="text-sm text-wood" data-testid="help-unknown">There is no help page called “{slug}”. These are the four:</p>
            ) : (
              <p>One walk for each person on Teaky, using the words on the screens.</p>
            )}
            <ul className="list-disc space-y-1 pl-6">
              {HELP_SLUGS.map((key) => (
                <li key={key}>
                  <Link to={`/help/${key}`} className="font-medium text-teak-dark underline-offset-2 hover:underline">
                    {HELP_PAGES[key].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
