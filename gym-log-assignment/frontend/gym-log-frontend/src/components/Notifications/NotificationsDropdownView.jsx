import React from 'react';

export default function NotificationsDropdownView({
  logoSrc = '/notification_image.jpg',
  // in future: items = [], onMarkAllRead, onItemClick, etc.
}) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      style={{
        position: 'absolute',
        top: '90%',
        right: '-200px',
        width: 320,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        padding: 12,
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>Notifications</strong>
        {/* reserved for future actions */}
      </div>

      {/* Empty state */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 8px',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <img
          src={logoSrc}
          alt="App logo"
          width={200}
          height={200}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          style={{ marginBottom: 10, opacity: 0.9 }}
        />
        <div style={{ fontSize: 14 }}>You’re up-to-date</div>
      </div>
    </div>
  );
}
