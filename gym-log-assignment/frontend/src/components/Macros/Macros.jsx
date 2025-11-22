// src/components/Macros/Macros.jsx
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getNutritionSnapshots } from '../../services/api';

// Shows the same "Macros (g)" chart as on the Nutrition page,
// using the latest snapshots from the backend.
export default function Macros() {
  const { getAccessToken } = useAuth();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


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
        console.error('Failed to load macro snapshots:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getAccessToken]);

  // Mirror NutritionTrends: newest first from API → show oldest on the left,
  // and just show the most recent 7 days.
  const chronological = (snapshots || [])
    .slice(0, 7)
    .reverse()
    .map((d) => ({
      ...d,
      shortDate: (d.date || '').slice(5), // MM-DD
    }));

  const hasData = chronological.some(
    (d) => d.carbs_g || d.fat_g || d.protein_g
  );

  return (
    <div
    type="button"
    onClick={() => navigate('/nutrition')} 
    style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Macros (g)</h3>

      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#64748b',
          }}
        >
          Loading…
        </div>
      ) : !hasData ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          Log some meals or save a nutrition snapshot to see your macro history.
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chronological}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shortDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Order + colors to match the Nutrition page */}
              <Bar
                dataKey="carbs_g"
                name="Carbs"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="fat_g"
                name="Fat"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="protein_g"
                name="Protein"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
