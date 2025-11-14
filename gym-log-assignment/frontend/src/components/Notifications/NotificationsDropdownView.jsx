import React from 'react';

export default function NotificationsDropdownView({
  logoSrc = '/notification_image.jpg',
  items = [],
  loading = false,
  notificationsEnabled = true,
  onToggleEnabled,
  onDeleteNotification,
  
}) 
{
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

        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          onClick={onToggleEnabled}            
          style={{
            display:'inline-flex', alignItems:'center', gap:8,
            fontSize:12, color:'#374151', background:'transparent', border:'none', cursor:'pointer',
          }}
        >
        <span>{notificationsEnabled ? 'On' : 'Off'}</span>
        <span
          style={{
            width: 36, height: 20, borderRadius: 9999, position:'relative',
            background: notificationsEnabled ? '#22c55e' : '#e5e7eb',
            transition: 'background 120ms',
          }}
        > 
        <span
          style={{
            position:'absolute', top:2, left: notificationsEnabled ? 18 : 2,
            width:16, height:16, borderRadius:'50%', background:'white',
            boxShadow:'0 1px 2px rgba(0,0,0,0.15)', transition:'left 120ms',
          }}
        />
        </span>
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div style={{ color: '#6b7280', fontSize: 14, padding: '12px 4px' }}>
          Loading…
        </div>
      ) : items.length === 0 ? (
        // Empty state
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
    ) : (
        // Items list
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          {items.map((n) => (
            <li
              key={n.id}
              style={{
                padding: '8px 6px',
                borderRadius: 8,
                background: n.is_read ? 'transparent' : '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
                gap:8,
              }}
            >
               <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 14 }}>{n.message}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>
                    {n.created_at
                    ? new Date(n.created_at).toLocaleString()
                    : ''}
                  </span>
                </div>

                {onDeleteNotification && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNotification(n.id);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 12,
                    padding: '2px 6px',
                    borderRadius: 6,
                  }}
                  aria-label="Delete notification"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
