// src/components/Notifications/useNotificationsDropdownBehavior.js
import { useEffect, useRef, useCallback } from 'react';

export default function useNotificationsDropdownBehavior({ onClose, rootRef }) {
  const internalRef = useRef(null);
  const ref = rootRef || internalRef;

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Attach outside-click + ESC listeners only when enabled (parent controls "open").
  const bindOutsideAndEsc = (enabled) => {
    if (!enabled) return () => {};

    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  };

  return { ref, bindOutsideAndEsc, close };
}