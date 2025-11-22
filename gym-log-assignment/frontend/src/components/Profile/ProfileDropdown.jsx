import React from "react";

export default function ProfileDropdown({
  isOpen,
  onClose,
  onProfile,
  onLogout,
  onDeleteAccount,
}) {
  if (!isOpen) return null;

  const handleClick = (fn) => {
    if (fn) fn();
    if (onClose) onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        marginTop: 6,
        background: "#ffffff",
        color: "#111827",
        borderRadius: 8,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        minWidth: 160,
        padding: "6px 0",
        zIndex: 60,
      }}
    >
      {/* Profile */}
      <button
        type="button"
        onClick={() => handleClick(onProfile)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px 12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          color: "#111827",
        }}
      >
        Profile
      </button>

      {/* Logout (optional) */}
      {onLogout && (
        <button
          type="button"
          onClick={() => handleClick(onLogout)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: "#111827",
          }}
        >
          Logout
        </button>
      )}

      {/* Delete Account (optional & red) */}
      {onDeleteAccount && (
        <button
          type="button"
          onClick={() => handleClick(onDeleteAccount)}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: "#b91c1c",
          }}
        >
          Delete Account
        </button>
      )}
    </div>
  );
}
