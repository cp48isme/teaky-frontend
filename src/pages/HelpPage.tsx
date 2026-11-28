import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Markdown from '../components/Markdown';
import SiteFooter from '../components/layout/SiteFooter';
import { searchHelp } from '../lib/helpSearch';
import floor from '../content/help/floor.md?raw';
import admin from '../content/help/admin.md?raw';
import hotelBuyer from '../content/help/hotel-buyer.md?raw';
import rgiAdmin from '../content/help/rgi-admin.md?raw';
import whereIs from '../content/help/where-is.md?raw';

/** /help and /help/:slug (t11, 25 Nov 2026): the user manual, one markdown
 * file per person, served the way /privacy and /terms are (ContentPage):
 * the file is rendered by src/lib/markdown.ts; Clayton edits the markdown,
 * the next build ships it. /help is the index of the four. */
const HELP_PAGES = {
  floor: { title: 'On the production floor', source: floor },
  admin: { title: 'Running the shop', source: admin },
  'hotel-buyer': { title: 'Ordering as a hotel buyer', source: hotelBuyer },
  'rgi-admin': { title: 'RGI admin: the day across the hotels', source: rgiAdmin },
  // Navigation 1d (dispatch 28 Nov 2026 afternoon; kkqk): the reference page —
  // every feature of revs 43–48 → shell → page → who sees it.
  'where-is': { title: 'Where is…', source: whereIs },
} as const;

type HelpSlug = keyof typeof HELP_PAGES;

/** The four walks, one per person; the reference page is listed apart. */
const WALK_SLUGS: HelpSlug[] = ['floor', 'admin', 'hotel-buyer', 'rgi-admin'];
const REFERENCE_SLUGS: HelpSlug[] = ['where-is'];

function isHelpSlug(value: string | undefined): value is HelpSlug {
  return value !== undefined && value in HELP_PAGES;
}

export default function HelpPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = isHelpSlug(slug) ? HELP_PAGES[slug] : null;
  // The search box (1d): client-side, over the five files' sections; results are page › section links.
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchHelp(query, Object.entries(HELP_PAGES).map(([key, p]) => ({ slug: key, title: p.title, source: p.source }))), [query]);
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
        <form role="search" className="mb-6" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm font-medium text-brand-dark" htmlFor="help-search">Search the manual</label>
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="a word on a screen — Held, push out, invitation, Lane…"
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-brand-dark placeholder-gray-400 focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
            data-testid="help-search"
          />
          {query.trim().length >= 2 ? (
            <ul className="mt-3 space-y-1 text-sm" data-testid="help-results" aria-live="polite">
              {hits.length === 0 ? <li className="text-wood" data-testid="help-no-results">Nothing in the manual says “{query.trim()}”.</li> : null}
              {hits.map((hit) => (
                <li key={`${hit.slug}#${hit.id}`}>
                  <Link to={`/help/${hit.slug}#${hit.id}`} className="font-medium text-teak-dark underline-offset-2 hover:underline" onClick={() => setQuery('')}>
                    {hit.pageTitle} › {hit.heading}
                  </Link>
                  <span className="text-wood"> — {hit.snippet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </form>
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
              {WALK_SLUGS.map((key) => (
                <li key={key}>
                  <Link to={`/help/${key}`} className="font-medium text-teak-dark underline-offset-2 hover:underline">
                    {HELP_PAGES[key].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!page ? (
          <div className="mt-6 space-y-3 text-brand-dark" data-testid="help-reference">
            <h2 className="font-heading text-lg font-semibold">Reference</h2>
            <ul className="list-disc space-y-1 pl-6">
              {REFERENCE_SLUGS.map((key) => (
                <li key={key}>
                  <Link to={`/help/${key}`} className="font-medium text-teak-dark underline-offset-2 hover:underline">
                    {HELP_PAGES[key].title}
                  </Link>{' '}
                  <span className="text-sm text-wood">— every feature of revs 43–48: which shell, which page, who sees it</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <SiteFooter />
    </div>
  );
}
