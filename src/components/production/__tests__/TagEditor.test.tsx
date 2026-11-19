import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TagEditor, { nextTags } from '../TagEditor';

/** Tags editing (t08, 19 Nov 2026): the chips, a remove control on each, a
 * picker over the shop's list and a free text for a new tag; a read-only
 * reader gets the chips alone. */

describe('TagEditor', () => {
  it('removes a tag, picks one from the shop list, adds a typed one once, trimmed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TagEditor tags={['Express']} options={['Express', 'Rush', 'Hotel']} readOnly={false} onChange={onChange} />);
    const editor = screen.getByTestId('tag-editor');
    expect(within(editor).getAllByTestId('row-tag').map((t) => t.textContent)).toEqual(['Express']);
    await user.click(screen.getByRole('button', { name: 'Remove tag Express' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
    // The picker offers only what is not on the order.
    const picker = screen.getByRole('combobox', { name: 'Pick a tag' });
    expect(within(picker).getAllByRole('option').map((o) => o.textContent)).toEqual(['Pick a tag…', 'Rush', 'Hotel']);
    await user.selectOptions(picker, 'Rush');
    expect(onChange).toHaveBeenLastCalledWith(['Express', 'Rush']);
    await user.type(screen.getByRole('textbox', { name: 'New tag' }), '  Produce ');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onChange).toHaveBeenLastCalledWith(['Express', 'Produce']);
    expect(nextTags(['Express'], 'Express')).toEqual(['Express']);
    expect(nextTags(['Express'], '   ')).toEqual(['Express']);
  });

  it('is chips only for a read-only reader; compact mode opens on + tag', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<TagEditor tags={['Express']} options={['Rush']} readOnly onChange={() => {}} />);
    expect(screen.getAllByTestId('row-tag').map((t) => t.textContent)).toEqual(['Express']);
    expect(screen.queryByRole('button')).toBeNull();
    unmount();
    render(<TagEditor tags={['Express']} options={['Rush']} readOnly={false} compact onChange={() => {}} />);
    expect(screen.queryByRole('textbox', { name: 'New tag' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Add tag' }));
    expect(screen.getByRole('textbox', { name: 'New tag' })).toBeInTheDocument();
  });
});
