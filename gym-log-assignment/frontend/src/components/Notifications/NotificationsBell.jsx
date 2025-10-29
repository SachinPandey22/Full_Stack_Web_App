// TODOs:
// - replace with bell icon
// - wire unread count from /api/notifications
// - add dropdown + mark-as-read

import React from 'react';

export default function NotificationsBell({onClick, hasUnread}) {
  return (
    <button
      aria-label="Notifications"
      title="Notifications"
      onClick={onClick}
      style={{
        position: 'relative',
        left:'140px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        background: '#007bff',
        cursor: 'pointer',
        
      }}
    >

      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" stroke="white" strokeWidth="2.5" />
      </svg>

      {hasUnread && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 9,
            height: 9,
            borderRadius: '9999px',
            background: '#ff0000ff',
          }}
        />
      )}
    </button>
  );

}