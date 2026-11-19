import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ContentPage from '../ContentPage';
import ReportBugPage from '../ReportBugPage';
import SiteFooter from '../../components/layout/SiteFooter';
import AuthShell from '../../components/auth/AuthShell';

/** The footer on every page (t02): Privacy, Terms, Contact Teaky, Report a
 * bug; the content pages render the files with the Draft label; the contact
 * address is selectable text, not a mailto; a signed-out visitor is sent to
 * sign in before reporting. */

let authed = false;
vi.mock('../../api/client', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../api/client')>()), isAuthenticated: () => authed }));

describe('the site footer and the content pages', () => {
  it('the footer carries the four links and sits in the auth shell', () => {
    render(
      <MemoryRouter>
        <AuthShell title="x"><div /></AuthShell>
      </MemoryRouter>,
    );
    const footer = screen.getByTestId('site-footer');
    expect(Array.from(footer.querySelectorAll('a')).map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Contact Teaky', '/contact'],
      ['Report a bug', '/report-a-bug'],
    ]);
  });

  it('the content pages render the files with a Draft label; contact shows the address as text, no mailto', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <Routes>
          <Route path="/contact" element={<ContentPage page="contact" />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('draft-label')).toHaveTextContent('Draft');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contact Teaky');
    const code = screen.getByText('hello@teakygrove.com');
    expect(code.tagName).toBe('CODE');
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('a signed-out visitor is sent to sign in before reporting; a signed-in one gets the form', () => {
    authed = false;
    const { unmount } = render(<MemoryRouter><ReportBugPage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=%2Freport-a-bug');
    expect(screen.queryByTestId('bug-report-form')).toBeNull();
    unmount();
    authed = true;
    render(<MemoryRouter><ReportBugPage /></MemoryRouter>);
    expect(screen.getByTestId('bug-report-form')).toBeTruthy();
    expect(screen.getByLabelText('What happened')).toBeTruthy();
    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
    render(<MemoryRouter><SiteFooter /></MemoryRouter>);
  });
});
