import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNutritionSnapshots } from "../../services/api";

export default function NutritionCard() {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the same snapshot data used on the Nutrition page
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getNutritionSnapshots(token);
        if (mounted) {
          setSnapshots(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load nutrition snapshots for dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getAccessToken]);

  // Oldest → newest, short date for x-axis
  const chronological = (snapshots || [])
    .slice(0, 7)               // show last ~7 points
    .reverse()
    .map((d) => ({
      ...d,
      shortDate: (d.date || "").slice(5), // "MM-DD"
    }));

  const hasData = chronological.some((d) => d.target_calories);

  return (
    <div
      onClick={() => navigate("/nutrition")}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",           // fill the dashboard card only
        cursor: "pointer",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Target Calories
        </h3>
      </div>

      {/* Chart or states */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          Loading…
        </div>
      ) : !hasData ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          No target history yet. Save a nutrition snapshot to see this chart.
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chronological}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shortDate" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="target_calories"
                name="kcal"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
