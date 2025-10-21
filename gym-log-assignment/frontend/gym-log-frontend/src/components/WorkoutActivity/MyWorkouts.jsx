import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Adjust path if needed


export default function MyWorkouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessToken } = useAuth();


 useEffect(() => {
  fetchWorkouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchWorkouts = async () => {
    try {
      const token = getAccessToken();

      const response = await fetch('http://127.0.0.1:8000/api/my-workouts/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      } else if (response.status === 401) {
        alert('Please login to view workouts');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this exercise from your workout list?')) return;
    
    try {
      const token = getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/api/my-workouts/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchWorkouts();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove workout');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/workout-library')} 
          style={{ 
            marginBottom: 24, 
            color: '#60a5fa', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          ← Back to Library
        </button>
        
        <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>My Workouts</h1>
        <p style={{ color: '#9ca3af', marginBottom: 32 }}>Your personalized exercise collection</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, fontSize: 18 }}>
            Loading your workouts...
          </div>
        ) : workouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💪</div>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>No workouts yet</h2>
            <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 24 }}>
              Start building your workout routine by adding exercises from the library
            </p>
            <button 
              onClick={() => navigate('/workout-library')}
              style={{ 
                background: '#9333ea', 
                color: 'white', 
                padding: '12px 24px', 
                borderRadius: 8, 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: 16
              }}
            >
              Browse Exercise Library
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {workouts.map((workout) => (
              <div 
                key={workout.id} 
                style={{ 
                  background: '#1f2937', 
                  padding: 20, 
                  borderRadius: 12, 
                  border: '1px solid #374151',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img 
                  src={workout.exercise.image} 
                  alt={workout.exercise.name} 
                  style={{ 
                    width: '100%', 
                    height: 200, 
                    objectFit: 'cover', 
                    borderRadius: 8, 
                    marginBottom: 16 
                  }} 
                />
                
                <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
                  {workout.exercise.name}
                </h3>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: '#3b82f6', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                    {workout.exercise.muscle_group}
                  </span>
                  <span style={{ background: '#ef4444', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                    {workout.exercise.difficulty}
                  </span>
                </div>
                <p style={{ color: '#9ca3af', marginBottom: 16, fontSize: 14 }}>
                  {workout.exercise.description}
                </p>
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => navigate(`/exercises/${workout.exercise.id}`)} 
                    style={{ 
                      flex: 1, 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '10px 16px', 
                      borderRadius: 8, 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 14
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleRemove(workout.id)} 
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '10px 16px', 
                      borderRadius: 8, 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 14
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
