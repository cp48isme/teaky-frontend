import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CompanyProfilePage from '../CompanyProfilePage';

// t06 (19 Nov 2026): the shop's company page — display name (the
// organisation's name, PATCH /organizations/me), logo by upload or URL, the
// contact details on the company profile; a printer_admin edits, a sales_rep reads.

const profile = {
  id: 'p1', organization_id: 'o1', website_url: 'https://single.example', logo_url: '/uploads/old.png', industry: null,
  description: null, phone: '555-0100', address_line1: null, address_line2: null, location_city: 'Austin',
  location_state: 'TX', location_country: null, postal_code: null, brand_colors: null,
  is_wizard_complete: true, created_at: '2026-11-19T00:00:00Z', updated_at: '2026-11-19T00:00:00Z',
};
const updateMyOrganization = vi.fn().mockResolvedValue({ id: 'o1', name: 'Single Source US (shadow)', is_managed: false });
const updateCompanyProfile = vi.fn().mockResolvedValue({ ...profile, logo_url: '/uploads/new.png' });
const createCompanyProfile = vi.fn();
const uploadFile = vi.fn().mockResolvedValue({ url: '/uploads/new.png', filename: 'mark.png', content_type: 'image/png' });
let roles: string[] = ['printer_admin'];
// Backend #320 (ruled 26 Nov 2026, item 9): the logo preview is read through
// the authenticated client and shown from an object URL, not a bare /uploads src.
const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();

vi.mock('../../../api/organizations', () => ({
  getMyOrganization: vi.fn(() => Promise.resolve({ id: 'o1', name: 'Single Source US', is_managed: false })),
  updateMyOrganization: (...args: unknown[]) => updateMyOrganization(...args),
}));
vi.mock('../../../api/companyProfiles', () => ({
  getCompanyProfileByOrg: vi.fn(() => Promise.resolve(profile)),
  updateCompanyProfile: (...args: unknown[]) => updateCompanyProfile(...args),
  createCompanyProfile: (...args: unknown[]) => createCompanyProfile(...args),
}));
vi.mock('../../../api/uploads', () => ({ uploadFile: (...args: unknown[]) => uploadFile(...args) }));
vi.mock('../../../hooks/useOrganizationId', () => ({ useOrganizationId: () => 'o1' }));
vi.mock('../../../lib/roles', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../lib/roles')>();
  return { ...actual, currentRoles: () => roles };
});

async function renderPage() {
  const { resetMyOrganization } = await import('../../../hooks/useMyOrganization');
  resetMyOrganization();
  render(
    <MemoryRouter>
      <CompanyProfilePage />
    </MemoryRouter>,
  );
  return screen.findByLabelText('Display name');
}

describe('CompanyProfilePage', () => {
  beforeEach(() => {
    updateMyOrganization.mockClear();
    updateCompanyProfile.mockClear();
    createCompanyProfile.mockClear();
    uploadFile.mockClear();
    roles = ['printer_admin'];
    fetchMock.mockReset();
    // A fresh Response per call: a body can be read once, and the page reads the old logo and then the new.
    fetchMock.mockImplementation(() => Promise.resolve(new Response(new Blob(['png']), { status: 200 })));
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(URL, 'createObjectURL', { value: () => 'blob:test-object', configurable: true, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: () => undefined, configurable: true, writable: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the name and the profile, and saves a new name through PATCH /organizations/me and the details through the profile', async () => {
    const nameInput = await renderPage();
    expect(nameInput).toHaveValue('Single Source US');
    expect(screen.getByLabelText('Phone')).toHaveValue('555-0100');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Single Source US (shadow)');
    await userEvent.clear(screen.getByLabelText('City'));
    await userEvent.type(screen.getByLabelText('City'), 'Kansas City');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByRole('status');
    expect(updateMyOrganization).toHaveBeenCalledWith({ name: 'Single Source US (shadow)' });
    expect(updateCompanyProfile).toHaveBeenCalledWith('p1', expect.objectContaining({ location_city: 'Kansas City', phone: '555-0100', logo_url: '/uploads/old.png' }));
    expect(createCompanyProfile).not.toHaveBeenCalled();
  });

  it('leaves the organisation alone when the name is unchanged', async () => {
    await renderPage();
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByRole('status');
    expect(updateMyOrganization).not.toHaveBeenCalled();
    expect(updateCompanyProfile).toHaveBeenCalledTimes(1);
  });

  it('uploads a chosen logo file and puts its URL in the form', async () => {
    await renderPage();
    const file = new File(['png'], 'mark.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText('Upload logo'), file);
    await waitFor(() => expect(screen.getByLabelText('Logo URL')).toHaveValue('/uploads/new.png'));
    expect(uploadFile).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('img', { name: 'Single Source US logo' })).toHaveAttribute('src', 'blob:test-object');
    expect(fetchMock).toHaveBeenLastCalledWith('/api/uploads/new.png', expect.anything());
  });

  it('is read-only for a sales_rep: no Save, no upload, fields disabled', async () => {
    roles = ['sales_rep'];
    const nameInput = await renderPage();
    expect(nameInput).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Upload logo')).not.toBeInTheDocument();
    expect(screen.getByText(/Only a shop admin can change them/)).toBeInTheDocument();
  });
});
