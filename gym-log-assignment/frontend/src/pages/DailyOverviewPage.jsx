import React from 'react';
import { useNavigate } from 'react-router-dom';
import DailyOverview from '../components/DailyOverview/DailyOverview';

export default function DailyOverviewPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e2a4bff 40%, #38bdf8 100%)',
        padding: '48px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          color: 'white',
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(15,23,42,0.35)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '18px' }}>←</span>
          Back to Dashboard
        </button>

        <div
          style={{
            borderRadius: '24px',
            padding: '32px',
            background: 'rgba(15, 23, 42, 0.45)',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            marginBottom: '32px',
          }}
        >
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Daily Overview</p>
          <h1 style={{ fontSize: '42px', margin: '8px 0 12px' }}>Your Daily Snapshot</h1>
          <p style={{ fontSize: '18px', lineHeight: 1.6, maxWidth: '650px', opacity: 0.95 }}>
            Stay on top of calories, workouts, and macros with a clean, focused interface.
            Everything is tuned for today so you can make the next best move.
          </p>
        </div>

        <div
          style={{
            background: '#e0f2ff',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(14, 165, 233, 0.35)',
          }}
        >
          <DailyOverview />
        </div>
      </div>
    </div>
  );
}
