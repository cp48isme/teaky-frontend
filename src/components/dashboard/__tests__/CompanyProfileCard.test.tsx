import { render, screen } from '@testing-library/react';
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
