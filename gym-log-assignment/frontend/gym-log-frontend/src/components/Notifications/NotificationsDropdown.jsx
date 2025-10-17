import React, { useEffect } from 'react';
import useNotificationsDropdownBehavior from './useNotificationsDropdownBehavior';
import NotificationsDropdownView from './NotificationsDropdownView';

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

  // Bind/unbind listeners when open changes
  useEffect(() => bindOutsideAndEsc(!!isOpenExternal), [isOpenExternal, bindOutsideAndEsc]);

  if (!isOpenExternal) return null;

  // Wrapper div holds the ref for outside-click detection.
  return (
    <div /* ref is on the parent wrapper via anchorRef */>
      <NotificationsDropdownView logoSrc={logoSrc} />
    </div>
  );
}
