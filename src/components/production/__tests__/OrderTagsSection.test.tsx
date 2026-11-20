import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import OrderTagsSection from '../OrderTagsSection';

/** The order page's tag editor (t08, 19 Nov 2026): every change is saved
 * whole through the page's PATCH; the picker is the shop's list. */

vi.mock('../../../api/orders', () => ({ listShopTags: vi.fn(() => Promise.resolve({ tags: ['Express', 'Rush'] })) }));

describe('OrderTagsSection', () => {
  it('saves the whole list on add and on remove', async () => {
    const onSave = vi.fn((next: string[]) => Promise.resolve(next));
    const user = userEvent.setup();
    render(<OrderTagsSection tags={['Express']} onSave={onSave} />);
    const picker = await screen.findByRole('combobox', { name: 'Pick a tag' });
    await user.selectOptions(picker, 'Rush');
    expect(onSave).toHaveBeenLastCalledWith(['Express', 'Rush']);
    await user.click(screen.getByRole('button', { name: 'Remove tag Express' }));
    expect(onSave).toHaveBeenLastCalledWith([]);
  });
});
