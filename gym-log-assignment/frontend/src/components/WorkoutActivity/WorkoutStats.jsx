import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { buildApiUrl } from '../../services/api';

export default function WorkoutStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { getAccessToken } = useAuth();

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const fetchStats = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${buildApiUrl('/api/workout-stats/')}?filter=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18 }}>Loading stats...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/my-workouts')} 
          style={{ marginBottom: 24, color: '#60a5fa', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}
        >
          ← Back to My Workouts
        </button>
        
        <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>📊 Workout Stats</h1>
        <p style={{ color: '#9ca3af', marginBottom: 32 }}>Track your progress and achievements</p>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {['week', 'month', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: filter === f ? '#9333ea' : '#374151',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          <div style={{ background: '#1f2937', padding: 24, borderRadius: 12, border: '2px solid #3b82f6' }}>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Total Workouts</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#3b82f6' }}>{stats.stats.total_workouts}</div>
            <div style={{ fontSize: 12, color: '#60a5fa', marginTop: 4 }}>Completed exercises</div>
          </div>
          
          <div style={{ background: '#1f2937', padding: 24, borderRadius: 12, border: '2px solid #10b981' }}>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Calories Burned</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#10b981' }}>🔥 {stats.stats.total_calories}</div>
            <div style={{ fontSize: 12, color: '#6ee7b7', marginTop: 4 }}>Total energy burned</div>
          </div>
          
          <div style={{ background: '#1f2937', padding: 24, borderRadius: 12, border: '2px solid #f59e0b' }}>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Total Time</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#f59e0b' }}>{stats.stats.total_minutes} min</div>
            <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>Time exercising</div>
          </div>
          
          <div style={{ background: '#1f2937', padding: 24, borderRadius: 12, border: '2px solid #ef4444' }}>
            <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>Current Streak</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ef4444' }}>🔥 {stats.streak.current} days</div>
            <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 4 }}>Keep it going!</div>
          </div>
           {/* Empty State - No Stats Yet */}
        {stats.stats.total_workouts === 0 && (
          <div style={{ 
            background: '#1f2937', 
            padding: 48, 
            borderRadius: 12, 
            border: '1px solid #374151',
            textAlign: 'center',
            marginTop: 40
          }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>📊</div>
            <h3 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 12 }}>No Stats Yet</h3>
            <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 24 }}>
              Complete your first workout to see your progress here!
            </p>
            <button 
              onClick={() => navigate('/my-workouts')}
              style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '14px 28px', 
                borderRadius: 8, 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 16
              }}
            >
              Go to My Workouts
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
