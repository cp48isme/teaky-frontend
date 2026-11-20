import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProductionSettingsPage, { parseTags } from '../ProductionSettingsPage';

/** Production settings (t08, 19 Nov 2026): the list-view default beside the
 * customer → tags rules; the rules are written whole; a shadow reader has
 * no page. */

const settings = { split_when_unplaceable: true, gang_whole_orders: true, hold_age_days: 2, shop_name: 'Single Source', timezone: 'America/Chicago', production_view: 'cards' as const };
const updateProductionSettings = vi.fn((s: typeof settings) => Promise.resolve(s));
const updateTagRules = vi.fn((r: { customer_tags: unknown[] }) => Promise.resolve(r));
vi.mock('../../../api/production', () => ({
  getProductionSettings: vi.fn(() => Promise.resolve(settings)),
  updateProductionSettings: (s: typeof settings) => updateProductionSettings(s),
  getTagRules: vi.fn(() => Promise.resolve({ customer_tags: [{ customer_match: 'Sprouts', channel: '', tags: ['Express'] }] })),
  updateTagRules: (r: { customer_tags: unknown[] }) => updateTagRules(r),
}));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])) }));

describe('ProductionSettingsPage', () => {
  it('sets the list-view default and writes the rules whole', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProductionSettingsPage readOnly={false} />
      </MemoryRouter>,
    );
    const rule = await screen.findByTestId('tag-rule');
    expect(within(rule).getByRole('textbox', { name: 'Customer' })).toHaveValue('Sprouts');
    expect(within(rule).getByRole('textbox', { name: 'Tags' })).toHaveValue('Express');
    await user.click(screen.getByRole('button', { name: 'List' }));
    await waitFor(() => expect(updateProductionSettings).toHaveBeenLastCalledWith({ ...settings, production_view: 'list' }));
    await user.click(screen.getByRole('button', { name: 'Add rule' }));
    const rules = screen.getAllByTestId('tag-rule');
    await user.type(within(rules[1]).getByRole('textbox', { name: 'Customer' }), 'Acme Hotels');
    await user.selectOptions(within(rules[1]).getByRole('combobox', { name: 'Channel' }), 'taylor');
    await user.type(within(rules[1]).getByRole('textbox', { name: 'Tags' }), 'Hotel, Rush, Hotel');
    await user.click(screen.getByRole('button', { name: 'Save rules' }));
    await waitFor(() =>
      expect(updateTagRules).toHaveBeenLastCalledWith({
        customer_tags: [
          { customer_match: 'Sprouts', channel: '', tags: ['Express'] },
          { customer_match: 'Acme Hotels', channel: 'taylor', tags: ['Hotel', 'Rush'] },
        ],
      }),
    );
    expect(parseTags(' a, b ,, a ')).toEqual(['a', 'b']);
  });

  it('refuses a rule without a tag before anything is sent, and shows no page to a shadow reader', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <MemoryRouter>
        <ProductionSettingsPage readOnly={false} />
      </MemoryRouter>,
    );
    const rule = await screen.findByTestId('tag-rule');
    await user.clear(within(rule).getByRole('textbox', { name: 'Tags' }));
    updateTagRules.mockClear();
    await user.click(screen.getByRole('button', { name: 'Save rules' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Every rule needs a customer and at least one tag.');
    expect(updateTagRules).not.toHaveBeenCalled();
    unmount();
    render(
      <MemoryRouter>
        <ProductionSettingsPage readOnly />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('no-floor-role')).toBeInTheDocument();
    expect(screen.queryByTestId('tag-rules')).toBeNull();
  });

  it('the bridge switch reads off by default, writes the whole resource with it on, and says the change is recorded', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProductionSettingsPage readOnly={false} />
      </MemoryRouter>,
    );
    const section = await screen.findByTestId('bridge-bundles');
    expect(within(section).getByRole('button', { name: 'Off' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(section).getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(within(section).getByRole('button', { name: 'On' }));
    await waitFor(() => expect(updateProductionSettings).toHaveBeenLastCalledWith({ ...settings, bridge_bundles_enabled: true }));
    expect(await screen.findByRole('status')).toHaveTextContent('This change is recorded');
    expect(within(section).getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'true');
  });
});

