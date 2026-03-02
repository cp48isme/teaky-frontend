import { useState, useEffect } from 'react';
import { listNotifications, markRead, markAllRead } from '../../api/notifications';
import type { Notification } from '../../types/notification';
import Spinner from '../../components/ui/Spinner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await listNotifications(showUnreadOnly);
      setNotifications(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadNotifications();
  }, [showUnreadOnly]);

  const handleMarkRead = async (id: string) => {
    await markRead([id]);
    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    await loadNotifications();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Unread only
          </label>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border bg-white px-4 py-3 transition-colors ${
                n.read_at ? 'border-gray-100' : 'border-indigo-200 bg-indigo-50/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!n.read_at && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                    <h3 className="text-sm font-medium text-gray-900">{n.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.read_at && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="ml-3 shrink-0 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
