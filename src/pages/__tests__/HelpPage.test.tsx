import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HelpPage from '../HelpPage';
import SiteFooter from '../../components/layout/SiteFooter';

/** The user manual (t11, 25 Nov 2026): the footer carries Help beside
 * Privacy and Terms; /help lists the four pages; each page renders its
 * file's first heading. */

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

describe('the Help link and the four manual pages', () => {
  it('the footer carries Help, to /help, beside Privacy and Terms', () => {
    render(
      <MemoryRouter>
        <SiteFooter />
      </MemoryRouter>,
    );
    const footer = screen.getByTestId('site-footer');
    const links = Array.from(footer.querySelectorAll('a')).map((a) => [a.textContent, a.getAttribute('href')]);
    expect(links).toContainEqual(['Help', '/help']);
    const names = links.map(([text]) => text);
    expect(names.indexOf('Help')).toBe(names.indexOf('Terms') + 1);
  });

  it('/help is the index of the four pages', () => {
    renderHelp('/help');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Help');
    const hrefs = Array.from(screen.getByTestId('help-index').querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/help/floor', '/help/admin', '/help/hotel-buyer', '/help/rgi-admin']);
  });

  it.each([
    ['floor', 'On the production floor'],
    ['admin', 'Running the shop'],
    ['hotel-buyer', 'Ordering as a hotel buyer'],
    ['rgi-admin', 'RGI admin: the day across the hotels'],
  ])('/help/%s renders its first heading', (slug, heading) => {
    renderHelp(`/help/${slug}`);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    expect(screen.getByRole('link', { name: '← Help' })).toHaveAttribute('href', '/help');
  });

  it('an unknown slug shows the index, not a blank page', () => {
    renderHelp('/help/no-such-page');
    expect(screen.getByTestId('help-unknown')).toHaveTextContent('no-such-page');
    expect(screen.getByRole('link', { name: 'On the production floor' })).toHaveAttribute('href', '/help/floor');
  });
});
