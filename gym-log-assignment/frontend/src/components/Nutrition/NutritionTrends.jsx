// src/components/Nutrition/NutritionTrends.jsx
import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar
} from 'recharts';

// expects data: [{ date: 'YYYY-MM-DD', target_calories, protein_g, fat_g, carbs_g }, ...]
export default function NutritionTrends({ data = [] }) {
  // API returns newest-first; show oldest-left → newest-right
  const chronological = (Array.isArray(data) ? [...data] : [])
    .reverse()
    .map(d => ({
      ...d,
      shortDate: (d.date || '').slice(5), // MM-DD
    }));

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Calories line */}
      <div style={{ height: 280, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Target Calories</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={chronological} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shortDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="target_calories"
              name="kcal"
              stroke="#6366f1"         // indigo
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Macro bars */}
      <div style={{ height: 320, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Macros (g)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chronological} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shortDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="protein_g" name="Protein" fill="#8b5cf6" radius={[4, 4, 0, 0]} /> {/* violet */}
            <Bar dataKey="fat_g"     name="Fat"     fill="#f59e0b" radius={[4, 4, 0, 0]} /> {/* amber */}
            <Bar dataKey="carbs_g"   name="Carbs"   fill="#22c55e" radius={[4, 4, 0, 0]} /> {/* green */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
