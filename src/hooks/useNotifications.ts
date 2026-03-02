import { useState, useEffect, useCallback } from 'react';
import { getUnreadCount } from '../api/notifications';
import { isAuthenticated } from '../api/client';

const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) return;
    try {
      const { count } = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silently fail on polling errors
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { unreadCount, refresh };
}
