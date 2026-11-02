import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../api/client';
import { StatusContext, type StatusApi } from '../../contexts/status';
import { failureText, useAction, type ActionOptions } from '../useAction';

function Harness<T>({ fn, options, label = 'RGI order number' }: { fn: () => Promise<T>; options?: ActionOptions<T>; label?: string }) {
  const action = useAction(label, fn, options);
  return (
    <>
      <button onClick={() => void action.run()}>{action.pending ? 'working' : 'go'}</button>
      <output data-testid="error">{action.error ?? ''}</output>
    </>
  );
}

function renderWithStatus<T>(props: Parameters<typeof Harness<T>>[0]) {
  const announce = vi.fn();
  const api: StatusApi = { message: null, announce, dismiss: vi.fn() };
  render(
    <StatusContext.Provider value={api}>
      <Harness {...props} />
    </StatusContext.Provider>,
  );
  return announce;
}

describe('useAction', () => {
  it('announces "<label> saved" when the mutation resolves', async () => {
    const announce = renderWithStatus({ fn: () => Promise.resolve({ id: 1 }) });
    await userEvent.click(screen.getByText('go'));
    await waitFor(() => expect(announce).toHaveBeenCalledWith('success', 'RGI order number saved'));
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('announces the server detail when the mutation fails, and keeps it for the form', async () => {
    const announce = renderWithStatus({
      fn: () => Promise.reject(new ApiError(422, 'Up to 4 packs per order here. For larger runs contact the desk.')),
    });
    await userEvent.click(screen.getByText('go'));
    await waitFor(() =>
      expect(announce).toHaveBeenCalledWith('error', 'Up to 4 packs per order here. For larger runs contact the desk.'),
    );
    expect(screen.getByTestId('error')).toHaveTextContent('Up to 4 packs per order here.');
  });

  it('lets the caller say what happened instead of "saved"', async () => {
    const announce = renderWithStatus({
      fn: () => Promise.resolve({ quantity: 2 }),
      options: { success: (r) => `Added ${r.quantity} packs to your cart` },
    });
    await userEvent.click(screen.getByText('go'));
    await waitFor(() => expect(announce).toHaveBeenCalledWith('success', 'Added 2 packs to your cart'));
  });

  it('says nothing on success when the page shows the result itself', async () => {
    const announce = renderWithStatus({ fn: () => Promise.resolve('x'), options: { success: false } });
    await userEvent.click(screen.getByText('go'));
    await waitFor(() => expect(screen.getByText('go')).toBeInTheDocument());
    expect(announce).not.toHaveBeenCalled();
  });

  it('is pending while the mutation runs', async () => {
    let finish!: () => void;
    renderWithStatus({ fn: () => new Promise<void>((resolve) => (finish = resolve)) });
    await userEvent.click(screen.getByText('go'));
    expect(screen.getByText('working')).toBeInTheDocument();
    finish();
    await waitFor(() => expect(screen.getByText('go')).toBeInTheDocument());
  });

  it('says nothing for the session-expired signal, which already sends the user to sign in', async () => {
    const announce = renderWithStatus({ fn: () => Promise.reject(new Error('Session expired')) });
    await userEvent.click(screen.getByText('go'));
    await waitFor(() => expect(screen.getByText('go')).toBeInTheDocument());
    expect(announce).not.toHaveBeenCalled();
  });

  it('works without a provider: the mutation still runs and the error is still returned to the form', async () => {
    const fn = vi.fn().mockRejectedValue(new ApiError(409, 'A draft cannot be activated without a price'));
    render(<Harness fn={fn} />);
    await userEvent.click(screen.getByText('go'));
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('A draft cannot be activated without a price'));
  });
});

describe('failureText', () => {
  it('uses the server detail for an ApiError and names the action for anything else', () => {
    expect(failureText('Save', new ApiError(400, 'detail here'))).toBe('detail here');
    expect(failureText('Save', new Error('Failed to fetch'))).toBe('Save: Failed to fetch');
    expect(failureText('Save', 'nope')).toBe('Save failed');
    expect(failureText('Save', new Error('Session expired'))).toBeNull();
  });
});
