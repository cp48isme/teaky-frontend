import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationBell from '../NotificationBell';
import type { Notification } from '../../../types/notification';

vi.mock('../../../api/notifications', () => ({
  listNotifications: vi.fn(),
  markRead: vi.fn(),
  markAllRead: vi.fn(),
}));

import {
  listNotifications,
  markRead,
  markAllRead,
} from '../../../api/notifications';

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'order.placed',
    title: 'New order placed',
    message: 'Order #1001 received',
    resource_type: 'order',
    resource_id: 'order-1001',
    context_snapshot: null,
    read_at: null,
    email_sent_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

function renderBell(props: {
  unreadCount?: number;
  onCountChange?: () => void;
} = {}) {
  const onCountChange = props.onCountChange ?? vi.fn();
  const unreadCount = props.unreadCount ?? 0;
  return {
    onCountChange,
    ...render(
      <MemoryRouter>
        <NotificationBell
          unreadCount={unreadCount}
          onCountChange={onCountChange}
        />
      </MemoryRouter>,
    ),
  };
}

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.mocked(listNotifications).mockReset();
    vi.mocked(markRead).mockReset();
    vi.mocked(markAllRead).mockReset();
    vi.mocked(listNotifications).mockResolvedValue([]);
    vi.mocked(markRead).mockResolvedValue(undefined);
    vi.mocked(markAllRead).mockResolvedValue(undefined);
  });

  it('hides the badge when unreadCount is 0', () => {
    renderBell({ unreadCount: 0 });
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByText('99+')).not.toBeInTheDocument();
  });

  it('shows the unread count on the badge', () => {
    renderBell({ unreadCount: 3 });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('caps the badge at 99+ for large counts', () => {
    renderBell({ unreadCount: 150 });
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('fetches notifications and opens the dropdown on click', async () => {
    vi.mocked(listNotifications).mockResolvedValue([]);
    renderBell({ unreadCount: 1 });

    await userEvent.click(screen.getByTitle('Notifications'));

    expect(listNotifications).toHaveBeenCalledWith(false, 10, 0);
    expect(await screen.findByText('Notifications')).toBeInTheDocument();
  });

  it('renders notification items returned from the API', async () => {
    vi.mocked(listNotifications).mockResolvedValue([
      makeNotification({ id: 'a', title: 'Order shipped', message: 'Order #42 shipped' }),
      makeNotification({ id: 'b', title: 'Proof ready', message: 'Proof for #43' }),
    ]);
    renderBell({ unreadCount: 2 });

    await userEvent.click(screen.getByTitle('Notifications'));

    expect(await screen.findByText('Order shipped')).toBeInTheDocument();
    expect(screen.getByText('Proof ready')).toBeInTheDocument();
  });

  it('shows an empty state when there are no notifications', async () => {
    vi.mocked(listNotifications).mockResolvedValue([]);
    renderBell({ unreadCount: 0 });

    await userEvent.click(screen.getByTitle('Notifications'));

    expect(await screen.findByText('No notifications')).toBeInTheDocument();
  });

  it('marks a single notification as read and notifies the parent', async () => {
    const notification = makeNotification({ id: 'notif-abc', read_at: null });
    vi.mocked(listNotifications).mockResolvedValue([notification]);
    const { onCountChange } = renderBell({ unreadCount: 2 });

    await userEvent.click(screen.getByTitle('Notifications'));
    const readButton = await screen.findByRole('button', { name: 'Read' });
    await userEvent.click(readButton);

    await waitFor(() => {
      expect(markRead).toHaveBeenCalledWith(['notif-abc']);
    });
    expect(onCountChange).toHaveBeenCalled();
  });

  it('marks all notifications as read and notifies the parent', async () => {
    vi.mocked(listNotifications).mockResolvedValue([
      makeNotification({ id: 'x', read_at: null }),
      makeNotification({ id: 'y', read_at: null }),
    ]);
    const { onCountChange } = renderBell({ unreadCount: 2 });

    await userEvent.click(screen.getByTitle('Notifications'));
    const markAllButton = await screen.findByRole('button', { name: 'Mark all read' });
    await userEvent.click(markAllButton);

    await waitFor(() => {
      expect(markAllRead).toHaveBeenCalled();
    });
    expect(onCountChange).toHaveBeenCalled();
  });

  it('closes the dropdown when clicking outside the component', async () => {
    vi.mocked(listNotifications).mockResolvedValue([]);
    renderBell({ unreadCount: 0 });

    await userEvent.click(screen.getByTitle('Notifications'));
    expect(await screen.findByText('Notifications')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('No notifications')).not.toBeInTheDocument();
    });
  });
});
