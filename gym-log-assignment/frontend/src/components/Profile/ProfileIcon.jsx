import React from "react";

export default function ProfileIcon({ onClick, title = "Profile", fullName }) {
  const rawName = typeof fullName === "string" ? fullName : "";
  const trimmedName = rawName.trim();
  const firstName = trimmedName ? trimmedName.split(/\s+/)[0] : "";


  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "0px 0px 0px 15px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.5)", // thin border around name + icon
        overflow: 'hidden',
        background: "rgba(0,0,0,0.15)",            // subtle pill background
      }}
     >
      {firstName && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#ffffff",
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {firstName} 
        </span>
      )}
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "0% 0% 0% 0%",
        background: "#007bff",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: 18,
        border: "none",
      }}
    >
      {/* Profile Icon SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle
          cx="12"
          cy="8"
          r="4.5"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Shoulders / body */}
        <path
          d="M5 19
             a7 7 0 0 1 14 0
             v2
             H5
             Z"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
    </div>
  );
}
