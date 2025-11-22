import React from "react";
import { Link } from "react-router-dom";
import "./SidePanelMenu.css";

export default function SidePanelMenu({ isOpen, onClose, menuItems }) {
  //if (!isOpen) return null; // don’t render anything when closed

  return (
    <>
      {/* Dark overlay behind panel */}
      <div
        onClick={isOpen ? onClose : undefined}
        className={`side-panel-overlay ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(255, 255, 255, 0.21)",
          zIndex: 40,
        }}
      />

      {/* Sliding side panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 360,
          background: "#ffffffff",
          color: "#e5e7eb",
          boxShadow: "4px 0 20px rgba(0,0,0,0.35)",
          zIndex: 50,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
        className={`side-panel ${isOpen ? "open" : ""}`}
      >
        <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 40,
          background: "#0337c8ff",
        }}
      />
        <div
          style={{
            marginLeft: 30,
            padding: "2 0px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            height: "100%",
          }}
        >
        {/* Panel header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 30, fontWeight:250, color: "#0337c8ff" }}>Navigate</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "transparent",
              position: 'absolute',
              right: '40px',
              border: "none",
              color: "#0337c8ff",
              cursor: "pointer",
              fontSize: 40,
              fontWeight: 50,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            height: 1,
            background: "#0337c8ff",
            marginBottom: 8,
          }}
        />

        {/* Menu links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, }}>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className = "side-panel-link"
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                textDecoration: "none",
                color: "#000000ff",
                fontSize: 24,
                fontWeight: 300
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        </div>
      </aside>
    </>
  );
}
