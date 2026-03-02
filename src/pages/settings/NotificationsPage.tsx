import { useState, useEffect } from 'react';
import {
  listNotifications,
  markRead,
  markAllRead,
  getPreferences,
  updatePreferences,
} from '../../api/notifications';
import type { Notification, NotificationPreference } from '../../types/notification';
import Spinner from '../../components/ui/Spinner';

const EVENT_LABELS: Record<string, string> = {
  order_placed: 'Order Placed',
  order_status_changed: 'Order Status Changed',
  order_created_on_behalf: 'Order Created on Behalf',
  order_files_uploaded: 'Order Files Uploaded',
  proof_needed: 'Proof Needed',
  proof_approved: 'Proof Approved',
  proof_rejected: 'Proof Rejected',
  quote_requested: 'Quote Requested',
  quote_provided: 'Quote Provided',
  quote_accepted: 'Quote Accepted',
  invitation_received: 'Invitation Received',
  team_member_joined: 'Team Member Joined',
  agent_escalation: 'Agent Escalation',
  agent_takeover_available: 'Agent Takeover Available',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [tab, setTab] = useState<'notifications' | 'preferences'>('notifications');

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

  const loadPreferences = async () => {
    try {
      const data = await getPreferences();
      setPreferences(data.preferences);
    } catch {
      // silently fail
    } finally {
      setPrefsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadNotifications();
  }, [showUnreadOnly]);

  useEffect(() => {
    if (tab === 'preferences') {
      loadPreferences();
    }
  }, [tab]);

  const handleMarkRead = async (id: string) => {
    await markRead([id]);
    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    await loadNotifications();
  };

  const handleTogglePref = async (
    eventType: string,
    field: 'email_enabled' | 'in_app_enabled',
  ) => {
    const pref = preferences.find((p) => p.event_type === eventType);
    if (!pref) return;

    const updated = { ...pref, [field]: !pref[field] };
    setPreferences((prev) =>
      prev.map((p) => (p.event_type === eventType ? updated : p)),
    );

    try {
      await updatePreferences({ preferences: [updated] });
    } catch {
      // Revert on error
      setPreferences((prev) =>
        prev.map((p) => (p.event_type === eventType ? pref : p)),
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setTab('notifications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'notifications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setTab('preferences')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === 'preferences'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Preferences
        </button>
      </div>

      {tab === 'notifications' && (
        <>
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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8 text-indigo-600" />
            </div>
          ) : notifications.length === 0 ? (
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
        </>
      )}

      {tab === 'preferences' && (
        <>
          {prefsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8 text-indigo-600" />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      Event Type
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                      In-App
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {preferences.map((pref) => (
                    <tr
                      key={pref.event_type}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="px-4 py-2.5 text-gray-900">
                        {EVENT_LABELS[pref.event_type] ?? pref.event_type}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={pref.in_app_enabled}
                          onChange={() =>
                            handleTogglePref(pref.event_type, 'in_app_enabled')
                          }
                          className="rounded border-gray-300 text-indigo-600"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={pref.email_enabled}
                          onChange={() =>
                            handleTogglePref(pref.event_type, 'email_enabled')
                          }
                          className="rounded border-gray-300 text-indigo-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
