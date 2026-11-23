import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProductsPage, { currentChoice, stockOptions } from '../ProductsPage';
import type { SpecLibraryRow } from '../../../types/production';

/** The stock rulings screen (a27 item 4, ruling 20 Nov 2026): product + one
 * stock dropdown per row; choosing writes the ruling against the product;
 * "not batched" is a choice; details stay collapsed until asked. */

const row = (over: Partial<SpecLibraryRow>): SpecLibraryRow => ({
  product_key: 'UHBC', value: '120#', not_batched: false, source: 'import', asserted_by_id: null, asserted_by: null,
  asserted_at: '2026-11-16T00:00:00Z', evidence: [], prior_units: 3, agrees: true, ...over,
});
const rows = [row({}), row({ product_key: 'HFAC-APT', value: 'unknown', source: 'person', asserted_by: 'Dana', prior_units: 0, agrees: null }), row({ product_key: 'PLU1020', product_name: 'Plush bear, 6 pack', value: 'unknown', source: 'person', asserted_by: 'Dana', prior_units: 0, agrees: null })];
const correctStock = vi.fn(() => Promise.resolve({}));
const markNotBatched = vi.fn(() => Promise.resolve({}));
const getSpecHistory = vi.fn(() => Promise.resolve([]));
vi.mock('../../../api/production', () => ({
  listSpecLibrary: vi.fn(() => Promise.resolve(rows)),
  getPressRunConfig: vi.fn(() => Promise.resolve({ docket_item_codes: { '80#': '18503', '100#': '18501', '120#': '18502', '16 C2S': '18504' } })),
  correctStock: (...a: unknown[]) => correctStock(...(a as [])),
  markNotBatched: (...a: unknown[]) => markNotBatched(...(a as [])),
  getSpecHistory: (...a: unknown[]) => getSpecHistory(...(a as [])),
}));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'S', mark: { url: 'x', alt: 'S', source: 'shop_profile' } })) }));

function mount() {
  return render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );
}

describe('the stock rulings screen', () => {
  it('lists the shop stocks plus any value in the library, and reads the current choice', () => {
    expect(stockOptions(rows, ['80#', '100#', '120#', '16 C2S'])).toEqual(['16 C2S', '80#', '100#', '120#']);
    expect(stockOptions([row({ value: '100# cream' })], ['80#'])).toEqual(['80#', '100# cream']);
    expect(currentChoice(row({}))).toBe('120#');
    expect(currentChoice(row({ value: 'unknown' }))).toBe('');
    expect(currentChoice(row({ not_batched: true }))).toBe('not batched');
  });

  it('one dropdown per row; choosing a stock records the ruling against the product; details stay collapsed', async () => {
    mount();
    const unknown = await screen.findByLabelText('Stock for HFAC-APT');
    expect((unknown as HTMLSelectElement).value).toBe('');
    expect(screen.queryByTestId('product-details')).toBeNull();
    await userEvent.selectOptions(unknown, '100#');
    await waitFor(() => expect(correctStock).toHaveBeenCalledWith('HFAC-APT', '100#', 'ruled on Products'));
    expect(await screen.findByRole('status')).toHaveTextContent('HFAC-APT: stock 100# — recorded against the product');
    await userEvent.selectOptions(screen.getByLabelText('Stock for UHBC'), 'not batched');
    await waitFor(() => expect(markNotBatched).toHaveBeenCalledWith('UHBC', 'ruled on Products'));
  });

  it('Details opens the provenance and history for that row only', async () => {
    mount();
    await screen.findByLabelText('Stock for UHBC');
    await userEvent.click(screen.getByLabelText('Details of UHBC'));
    const details = await screen.findByTestId('product-details');
    expect(within(details).getByText(/Andrew's table/)).toBeInTheDocument();
    expect(getSpecHistory).toHaveBeenCalledWith('UHBC');
    expect(screen.getAllByTestId('product-details')).toHaveLength(1);
  });

  it('names the product as the channel describes it, with the code beneath; the search finds it by name', async () => {
    mount();
    const named = (await screen.findByTestId('product-name')).closest('tr')!;
    expect(named).toHaveTextContent('Plush bear, 6 pack');
    expect(named).toHaveTextContent('PLU1020');
    await userEvent.type(screen.getByPlaceholderText('product name, code or stock'), 'plush');
    expect(screen.getAllByTestId('product-row')).toHaveLength(1);
    expect(screen.getByTestId('product-name')).toHaveTextContent('Plush bear, 6 pack');
  });
});
