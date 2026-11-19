import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CompanyProfileCard from '../CompanyProfileCard';

// Cause 5 (30 Oct 2026): the wizard link appears only for a self-serve signup.
describe('CompanyProfileCard', () => {
  it('offers the wizard to a self-serve signup with no profile', () => {
    render(<CompanyProfileCard profile={null} selfServe />);
    expect(screen.getByRole('link', { name: 'Complete the wizard' })).toHaveAttribute('href', '/get-started');
  });

  it('never links to the wizard for an organisation provisioned another way', () => {
    render(<CompanyProfileCard profile={null} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/No profile on file/)).toBeInTheDocument();
  });

  it('never links to the wizard for a managed account', () => {
    render(<CompanyProfileCard profile={null} managed />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText(/set up by Teaky/)).toBeInTheDocument();
  });
});

// t06 (19 Nov 2026): the card shows the shop's name and mark at a readable
// size and links a printer_admin to the company page; nobody else gets the link.
describe('CompanyProfileCard — name, mark and the company page (t06)', () => {
  const profile = {
    id: 'p1', organization_id: 'o1', website_url: null, logo_url: '/uploads/mark.png', industry: null,
    description: null, phone: null, address_line1: null, address_line2: null, location_city: null,
    location_state: null, location_country: null, postal_code: null, brand_colors: null,
    is_wizard_complete: true, created_at: '2026-11-19T00:00:00Z', updated_at: '2026-11-19T00:00:00Z',
  };

  it('shows the name and the logo at 80px and links a printer_admin to /settings/company', () => {
    render(
      <MemoryRouter>
        <CompanyProfileCard profile={profile} name="Single Source US" roles={['printer_admin']} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Single Source US')).toBeInTheDocument();
    const logo = screen.getByRole('img', { name: 'Single Source US logo' });
    expect(logo).toHaveAttribute('src', '/uploads/mark.png');
    expect(logo.className).toContain('h-20');
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/settings/company');
  });

  it('gives no company-page link to a sales_rep, and none with no profile either', () => {
    render(
      <MemoryRouter>
        <CompanyProfileCard profile={profile} name="Single Source US" roles={['sales_rep']} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument();
  });

  it('links a printer_admin to the page even before a profile exists', () => {
    render(
      <MemoryRouter>
        <CompanyProfileCard profile={null} name="New Shop" roles={['printer_admin']} />
      </MemoryRouter>,
    );
    expect(screen.getByText('New Shop')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/settings/company');
  });
});
