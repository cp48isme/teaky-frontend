import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HelpPage from '../HelpPage';
import { parseMarkdown } from '../../lib/markdown';
import { searchHelp } from '../../lib/helpSearch';
import whereIs from '../../content/help/where-is.md?raw';

/** Navigation 1d (dispatch 28 Nov 2026 afternoon; kkqk): the manual's
 * "Where is…" page — every feature of revs 43–48 → shell → page → who sees
 * it — and a search box over the manual. */

function renderHelp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/help" element={<HelpPage />} />
        <Route path="/help/:slug" element={<HelpPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('the Where is… page', () => {
  it('is listed on /help under Reference, apart from the four walks', () => {
    renderHelp('/help');
    const reference = screen.getByTestId('help-reference');
    expect(within(reference).getByRole('link', { name: 'Where is…' })).toHaveAttribute('href', '/help/where-is');
    const walks = Array.from(screen.getByTestId('help-index').querySelector('ul')!.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(walks).toEqual(['/help/floor', '/help/admin', '/help/hotel-buyer', '/help/rgi-admin']);
  });

  it('renders as tables with the four columns, headings carrying anchors', () => {
    renderHelp('/help/where-is');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Where is…');
    const tables = screen.getAllByRole('table');
    expect(tables.length).toBeGreaterThanOrEqual(4);
    expect(within(tables[0]!).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['What you are looking for', 'Shell', 'Page (how you get there)', 'Who sees it']);
    expect(document.getElementById('getting-between-the-shells')).not.toBeNull();
    expect(screen.getByText(/Production floor →/)).toBeInTheDocument();
  });

  it('names every rev 43–48 feature a person can see', () => {
    const text = whereIs;
    for (const words of ['Lane', 'Where did this order go', 'the batch page', 'Push out', 'Mark done', 'half batch', 'Proposals', 'Propose…', 'refused', 'Held', 'Tags by customer', 'Stocked goods', 'stock ruling', 'Floor', 'Theme', 'Powered by Teaky', 'RGI order #', 'Proofs', 'Revoke', 'Second approver', 'Audit Trail', 'Settings** → **Floor', '?']) {
      expect(text, words).toContain(words);
    }
  });
});

describe('the markdown reader: tables and heading ids', () => {
  it('reads a pipe table into a header and rows, and gives a heading an id', () => {
    const doc = parseMarkdown('## Getting around\n\n| A | B |\n|---|---|\n| one | **two** |\n| three | four |\n\nAfter.');
    expect(doc.blocks[0]).toMatchObject({ kind: 'heading', id: 'getting-around' });
    const table = doc.blocks[1];
    expect(table.kind).toBe('table');
    if (table.kind === 'table') {
      expect(table.header.map((c) => c.map((i) => i.text).join(''))).toEqual(['A', 'B']);
      expect(table.rows).toHaveLength(2);
      expect(table.rows[0]![1]![0]).toMatchObject({ kind: 'bold', text: 'two' });
    }
    expect(doc.blocks[2]).toMatchObject({ kind: 'paragraph' });
  });
});

describe('the search box', () => {
  const pages = [
    { slug: 'floor', title: 'On the production floor', source: '# On the production floor\n\n## Held\n\nAn order waits here when its stock is unknown.\n\n## Batches\n\nCards or a list.' },
    { slug: 'where-is', title: 'Where is…', source: whereIs },
  ];

  it('answers page › section with the heading anchor, case-insensitively, and nothing under two characters', () => {
    expect(searchHelp('h', pages)).toEqual([]);
    const hits = searchHelp('STOCK is unknown', pages);
    expect(hits[0]).toMatchObject({ slug: 'floor', pageTitle: 'On the production floor', heading: 'Held', id: 'held' });
    expect(searchHelp('Lane', pages).some((h) => h.slug === 'where-is')).toBe(true);
  });

  it('on /help: typing shows results as links into the pages; a word nobody wrote says so', async () => {
    renderHelp('/help');
    const box = screen.getByTestId('help-search');
    await userEvent.type(box, 'Lane');
    const results = await screen.findByTestId('help-results');
    const first = within(results).getAllByRole('link')[0]!;
    expect(first.getAttribute('href')).toMatch(/^\/help\/[a-z-]+#[a-z0-9-]+$/);
    expect(first.textContent).toContain('›');
    await userEvent.clear(box);
    await userEvent.type(box, 'zyxwvut');
    expect(await screen.findByTestId('help-no-results')).toHaveTextContent('zyxwvut');
  });
});
