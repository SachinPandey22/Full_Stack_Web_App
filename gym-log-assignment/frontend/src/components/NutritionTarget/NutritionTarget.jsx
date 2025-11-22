// src/components/NutritionTarget/NutritionTarget.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getNutritionTargets } from "../../services/api";

export default function NutritionTarget() {
  const { getAccessToken } = useAuth();
  const [targets, setTargets] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const t = await getNutritionTargets(token);

        // normalize like NutritionPage
        const normalized = t?.macros
          ? t
          : {
              ...t,
              macros: {
                protein_g: t?.protein_g ?? 0,
                fat_g: t?.fat_g ?? 0,
                carbs_g: t?.carbs_g ?? 0,
              },
              assumptions: t?.meta || {},
            };

        if (mounted) {
          setTargets(normalized);
        }
      } catch (err) {
        console.error("Failed to load nutrition targets:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getAccessToken]);

  const safeBmr = Math.round(targets?.bmr ?? 0);
  const safeTdee = Math.round(targets?.tdee ?? 0);
  const safeTarget = Math.round(targets?.target_calories ?? 0);

  const items = [
    { key: "bmr", label: "BMR", value: safeBmr, emoji: "🔥" },
    { key: "tdee", label: "TDEE", value: safeTdee, emoji: "⚡" },
    { key: "target", label: "TARGET", value: safeTarget, emoji: "🎯" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",          // let the green card control height
        gap: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Nutrition Targets
        </h3>
      </div>

      {/* thin divider */}
      <div
        style={{
          height: 1,
          background: "rgba(15,23,42,0.06)",
          marginTop: 2,
          marginBottom: 4,
        }}
      />

      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Loading…
        </div>
      ) : !targets ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          No targets yet. Complete your profile in the Nutrition page.
        </div>
      ) : (
        // stacked cards
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            overflowY: "auto",   // prevents overflowing out of the green card
          }}
        >
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                width: "100%",
                borderRadius: 18,
                borderBlockColor:'#ffffffff',
                background: 'transparent',
                boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
                padding: "10px 14px",     // thinner top/bottom
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "999px",
                  background: "#f3f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,          // slightly smaller icon
                }}
              >
                {item.emoji}
              </div>

              {/* Text block */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  {item.value.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  kcal/day
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
