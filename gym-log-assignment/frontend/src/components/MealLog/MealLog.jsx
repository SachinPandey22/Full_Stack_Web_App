// src/components/MealLogging/MealLog.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealLogging } from '../MealLogging/hooks/useMealLogging';

// small helper copied from ProgressSection
const toNumber = (value) => {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
};

const CircularStat = ({ label, unit, value, goal, color }) => {
  const size = 90;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeGoal = goal > 0 ? goal : 0;
  const rawPct = safeGoal ? (value / safeGoal) * 100 : 0;
  const pct = Math.max(0, Math.min(100, Math.round(rawPct)));
  const offset = circumference * (1 - pct / 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <svg width={size} height={size}>
        {/* background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* value in the middle */}
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#0f172a"
        >
          {value}{unit}
        </text>
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          {pct}% of goal
        </text>
      </svg>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#111827',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 11,
          color: '#6b7280',
        }}
      >
        Goal: {goal}{unit}
      </div>
    </div>
  );
};

export default function MealLog() {
  const navigate = useNavigate();
  const { totals, dailyGoals, loading, error } = useMealLogging();

  const calories = toNumber(totals.calories);
  const caloriesGoal = toNumber(dailyGoals.calories);

  const protein = toNumber(totals.protein);
  const proteinGoal = toNumber(dailyGoals.protein);

  const carbs = toNumber(totals.carbs);
  const carbsGoal = toNumber(dailyGoals.carbs);

  const fat = toNumber(totals.fat);
  const fatGoal = toNumber(dailyGoals.fat);

  const openMealLogging = () => {
    // use the same route you use elsewhere in the app
    navigate('/meal-logging');
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 12,
        background: '#b4ecfeff', // matches your meal-log card background
        padding: 6,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            color: '#0f172a',
          }}
        >
          Meal Logging
        </h3>

        <button
          type="button"
          onClick={openMealLogging}
          style={{
            padding: '6px 12px',
            borderRadius: 999,
            backgroundColor: '#007bff',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
          }}
        >
          Track
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#6b7280',
          }}
        >
          Loading…
        </div>
      ) : error ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#b91c1c',
          }}
        >
          Couldn&apos;t load meal stats
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 16,
            alignItems: 'center',
            justifyItems: 'center',
            paddingTop: 8,
          }}
        >
          <CircularStat
            label="Calories"
            unit=""
            value={calories}
            goal={caloriesGoal}
            color="#6366f1"
          />
          <CircularStat
            label="Protein"
            unit="g"
            value={protein}
            goal={proteinGoal}
            color="#22c55e"
          />
          <CircularStat
            label="Carbs"
            unit="g"
            value={carbs}
            goal={carbsGoal}
            color="#facc15"
          />
          <CircularStat
            label="Fat"
            unit="g"
            value={fat}
            goal={fatGoal}
            color="#a855f7"
          />
        </div>
      )}
    </div>
  );
}
