import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ActionResult from '../ActionResult';

/** The one way "an action happened here" is shown (overnight dispatch 26 Nov
 * 2026, item 4): done is a live region, refused an alert; the caller's words,
 * the component's shape. */

describe('ActionResult', () => {
  it('done is a status region, refused an alert; both carry the test id and the kind', () => {
    render(
      <>
        <ActionResult kind="done" testId="done-here">Batch 101 marked done; 3 remaining steps skipped.</ActionResult>
        <ActionResult kind="refused" testId="refused-here">Refused: Batch 101 was already marked done.</ActionResult>
      </>,
    );
    const done = screen.getByRole('status');
    expect(done).toHaveAttribute('data-testid', 'done-here');
    expect(done).toHaveAttribute('data-result', 'done');
    expect(done).toHaveTextContent('Batch 101 marked done; 3 remaining steps skipped.');
    const refused = screen.getByRole('alert');
    expect(refused).toHaveAttribute('data-testid', 'refused-here');
    expect(refused).toHaveAttribute('data-result', 'refused');
    expect(refused).toHaveTextContent('Refused: Batch 101 was already marked done.');
  });
});
