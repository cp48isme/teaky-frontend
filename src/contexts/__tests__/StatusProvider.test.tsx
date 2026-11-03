import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StatusProvider, { SUCCESS_VISIBLE_MS } from '../StatusProvider';
import { useStatus } from '../../hooks/useStatus';

function Announcer() {
  const { announce } = useStatus();
  return (
    <>
      <button onClick={() => announce('success', 'RGI order number saved')}>ok</button>
      <button onClick={() => announce('error', 'Up to 4 packs per order here.')}>fail</button>
    </>
  );
}

describe('StatusProvider', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('mounts one empty polite live region before anything is announced', () => {
    render(
      <StatusProvider>
        <Announcer />
      </StatusProvider>,
    );
    const region = screen.getByTestId('status-region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toBeEmptyDOMElement();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('shows a success in the region and clears it by itself', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <StatusProvider>
        <Announcer />
      </StatusProvider>,
    );
    await user.click(screen.getByText('ok'));
    expect(screen.getByTestId('status-region')).toHaveTextContent('RGI order number saved');
    act(() => {
      vi.advanceTimersByTime(SUCCESS_VISIBLE_MS + 1);
    });
    expect(screen.getByTestId('status-region')).toBeEmptyDOMElement();
  });

  it('keeps an error until it is dismissed, and the latest message replaces the one before', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <StatusProvider>
        <Announcer />
      </StatusProvider>,
    );
    await user.click(screen.getByText('fail'));
    act(() => {
      vi.advanceTimersByTime(SUCCESS_VISIBLE_MS * 3);
    });
    expect(screen.getByTestId('status-region')).toHaveTextContent('Up to 4 packs per order here.');
    await user.click(screen.getByText('ok'));
    const region = screen.getByTestId('status-region');
    expect(region).toHaveTextContent('RGI order number saved');
    expect(region).not.toHaveTextContent('Up to 4 packs');
    await user.click(screen.getByText('fail'));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.getByTestId('status-region')).toBeEmptyDOMElement();
  });
});
