import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ChoosePortalPage from '../ChoosePortalPage';

const listMyPortals = vi.fn();
vi.mock('../../api/auth', () => ({ listMyPortals: () => listMyPortals() }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ logout: vi.fn() }) }));

describe('ChoosePortalPage', () => {
  it('lists several portals as links', async () => {
    listMyPortals.mockResolvedValueOnce([
      { id: 'p1', name: 'The Raphael', slug: 'raphael', status: 'active' },
      { id: 'p2', name: 'Allegretto', slug: 'allegretto', status: 'active' },
      { id: 'p3', name: 'Old', slug: 'old', status: 'archived' },
    ]);
    render(<MemoryRouter><ChoosePortalPage /></MemoryRouter>);
    expect(await screen.findByRole('link', { name: 'The Raphael' })).toHaveAttribute('href', '/p/raphael');
    expect(screen.getByRole('link', { name: 'Allegretto' })).toHaveAttribute('href', '/p/allegretto');
    expect(screen.queryByText('Old')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('says so when the account has no portal, and never shows a sign-in form', async () => {
    listMyPortals.mockResolvedValueOnce([]);
    render(<MemoryRouter><ChoosePortalPage /></MemoryRouter>);
    expect(await screen.findByText(/not attached to an ordering page yet/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });
});
