import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ActionButton from '../ActionButton';

describe('ActionButton', () => {
  it('is disabled with the reason beside it, wired by aria-describedby', () => {
    render(<ActionButton reason="Add a name, email and phone for each pack">Add to Cart</ActionButton>);
    const button = screen.getByRole('button', { name: 'Add to Cart' });
    expect(button).toBeDisabled();
    const reason = screen.getByText('Add a name, email and phone for each pack');
    expect(button).toHaveAttribute('aria-describedby', reason.id);
    expect(button).toHaveAccessibleDescription('Add a name, email and phone for each pack');
  });

  it('is enabled with no reason text when there is nothing in the way', () => {
    render(<ActionButton reason={null}>Add to Cart</ActionButton>);
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('shows the pending label and is busy while pending', () => {
    render(
      <ActionButton pending pendingLabel="Adding...">
        Add to Cart
      </ActionButton>,
    );
    const button = screen.getByRole('button', { name: 'Adding...' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
