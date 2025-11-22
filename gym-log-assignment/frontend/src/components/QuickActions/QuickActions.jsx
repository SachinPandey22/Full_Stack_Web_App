// src/components/QuickActions/QuickActions.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

const green = "#0eb54bff";

// --- SVG ICONS -------------------------------------------------

function WeightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="3"
        ry="3"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
      />
      <path
        d="M12 10 L13.4 8.6"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* vertical bar */}
      <path
        d="M12 4v16"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* up arrow */}
      <path
        d="M9.5 7 L12 4.5 L14.5 7"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* down arrow */}
      <path
        d="M9.5 17 L12 19.5 L14.5 17"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* clock circle */}
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.8"
      />
      {/* clock hands */}
      <path
        d="M12 8v4l2.2 2.2"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SexIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* circle */}
      <circle
        cx="10"
        cy="10"
        r="4"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
      />
      {/* female cross */}
      <path
        d="M10 14.5v3.5M8.5 17H11.5"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* male arrow */}
      <path
        d="M13 7L16 4M16 6.5V4H13.5"
        fill="none"
        stroke="#F9FAFB"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function QuickActions() {
  const { profile } = useAuth();

  // 🔧 adjust these keys to match your profile model if needed
  const rawWeight = profile?.weight_kg ?? profile?.weight ?? null;
  const rawHeightCm = profile?.height_cm ?? profile?.height ?? null;
  const rawAge = profile?.age ?? null;
  const rawSex = profile?.sex ?? profile?.gender ?? null;

  // Height as feet (e.g. "5.6 ft")
  let heightDisplay = "—";
  if (typeof rawHeightCm === "number" && !Number.isNaN(rawHeightCm)) {
    const feet = rawHeightCm / 30.48;
    heightDisplay = `${feet.toFixed(1)} ft`;
  }

  const weightDisplay =
    typeof rawWeight === "number" && !Number.isNaN(rawWeight)
      ? `${rawWeight} kg`
      : "—";

  const ageDisplay =
    typeof rawAge === "number" && !Number.isNaN(rawAge)
      ? `${rawAge} yr`
      : "—";

  const sexDisplay = rawSex ? String(rawSex).toUpperCase() : "—";

  const stats = [
    { label: "Weight", value: weightDisplay, Icon: WeightIcon },
    { label: "Height", value: heightDisplay, Icon: HeightIcon },
    { label: "Age", value: ageDisplay, Icon: AgeIcon },
    { label: "Sex", value: sexDisplay, Icon: SexIcon },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        gap: 16,
      }}
    >

      {/* stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {stats.map(({ label, value, Icon }) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 80,
              flex: 1,
            }}
          >
            {/* round icon background */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "999px",
                background: green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Icon />
            </div>

            {/* neon value */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: green,
                marginBottom: 2,
              }}
            >
              {value}
            </div>

            {/* label */}
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
