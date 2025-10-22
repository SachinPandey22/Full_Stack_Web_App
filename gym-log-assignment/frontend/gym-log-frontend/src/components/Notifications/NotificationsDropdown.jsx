import React, { useEffect, useState } from 'react';
import useNotificationsDropdownBehavior from './useNotificationsDropdownBehavior';
import NotificationsDropdownView from './NotificationsDropdownView';
import { getNotifications, markAllNotificationsRead } from '../../services/notifications';

/**
 * Container/implementation: composes behavior + presentation.
 * Controlled by parent via isOpenExternal/onOpenChange.
 */
export default function NotificationsDropdown({
  isOpenExternal,            // boolean: parent-controlled open state
  onOpenChange,              // function(nextOpen: boolean)
  logoSrc = '/notification_image.jpg',
  anchorRef
}) {
  const { ref, bindOutsideAndEsc } = useNotificationsDropdownBehavior({
    onClose: () => onOpenChange?.(false),
    rootRef: anchorRef,
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);



  // Bind/unbind listeners when open changes
  useEffect(() => bindOutsideAndEsc(!!isOpenExternal), [isOpenExternal, bindOutsideAndEsc]);

  useEffect(() => {
    if (!isOpenExternal) return;
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const data = await getNotifications();       // [{id, message, is_read, created_at}, ...]
        if (alive) setItems(data);
      } catch (e) {
        // optional: toast.error('Failed to load notifications');
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [isOpenExternal]);

  if (!isOpenExternal) return null;

  // Wrapper div holds the ref for outside-click detection.
  return (
    <div /* ref is on the parent wrapper via anchorRef */>
      <NotificationsDropdownView 
        logoSrc={logoSrc} 
        items={items}
        loading={loading}
        onMarkAllRead={async () => {
          try {
            await markAllNotificationsRead();
            setItems(prev => prev.map(n => ({ ...n, is_read: true })));
          } catch (e) {
            // optional: toast.error('Failed to mark all read');
          }
        }}
        />
    </div>
  );
}
