import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ReportBugPage from '../ReportBugPage';

/** t07 (19 Nov 2026): "Choose a file" is a button with hover and pressed
 * states (the native input stays for the keyboard and the screen reader);
 * the confirmation names the reference and that a person reads every one;
 * the footer renders exactly once on /report-a-bug (it rendered twice). */

vi.mock('../../api/client', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../api/client')>()), isAuthenticated: () => true }));
const reportBug = vi.fn(async (_body: unknown) => ({ id: '18e04c25-0000-4000-8000-000000000000', created_at: '2026-11-19T20:00:00Z', notified: true }));
vi.mock('../../api/bugReports', () => ({ reportBug: (body: unknown) => reportBug(body) }));

function page() {
  return render(
    <MemoryRouter initialEntries={['/report-a-bug']}>
      <Routes>
        <Route path="/report-a-bug" element={<ReportBugPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('report a bug — follow-ups (t07)', () => {
  it('"Choose a file" is a button-styled label with hover and pressed states, bound to the file input', () => {
    page();
    const button = screen.getByTestId('choose-file');
    expect(button.tagName).toBe('LABEL');
    expect(button).toHaveTextContent('Choose a file');
    expect(button.getAttribute('for')).toBe('screenshot');
    expect(button.className).toMatch(/hover:/);
    expect(button.className).toMatch(/active:/);
    const input = screen.getByLabelText(/Choose a file/) as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.className).toContain('sr-only');
    expect(screen.getByTestId('chosen-file')).toHaveTextContent('No file chosen');
    const file = new File(['x'], 'shot.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByTestId('chosen-file')).toHaveTextContent('shot.png');
  });

  it('the confirmation reads the reference and that a person reads every one', async () => {
    page();
    fireEvent.change(screen.getByLabelText('What happened'), { target: { value: 'The Held list shows yesterday after a refresh.' } });
    fireEvent.submit(screen.getByTestId('bug-report-form'));
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy());
    expect(screen.getByRole('status')).toHaveTextContent('Thanks for the feedback. Your reference is 18e04c25; a person reads every one.');
    expect(reportBug).toHaveBeenCalledTimes(1);
  });

  it('the footer renders once on /report-a-bug', () => {
    page();
    expect(screen.getAllByTestId('site-footer')).toHaveLength(1);
  });
});
