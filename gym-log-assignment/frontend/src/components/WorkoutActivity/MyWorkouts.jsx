import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  


export default function MyWorkouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [duration, setDuration] = useState('');
  const [completing, setCompleting] = useState(false);
  const { getAccessToken } = useAuth();


 useEffect(() => {
  fetchWorkouts();
  
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

  const handleMarkComplete = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
    setDuration('');
  };

  const handleCompleteSubmit = async () => {
    if (!duration || duration <= 0) {
      alert('Please enter a valid duration (minimum 1 minute)');
      return;
    }

    setCompleting(true);
    try {
      const token = getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/api/my-workouts/${selectedWorkout.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed_date: new Date().toISOString(),
          duration_minutes: parseInt(duration)
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchWorkouts();
        alert('Workout completed! 🎉 Calories calculated automatically.');
      } else {
        const error = await response.json();
        alert('Failed to mark complete: ' + (error.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to complete workout');
    } finally {
      setCompleting(false);
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
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
  <button 
    onClick={() => navigate('/workout-library')} 
    style={{ 
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
  
  <button 
    onClick={() => navigate('/workout-stats')} 
    style={{ 
      background: '#9333ea', 
      color: 'white', 
      padding: '10px 20px', 
      borderRadius: 8, 
      border: 'none', 
      cursor: 'pointer', 
      fontWeight: 'bold'
    }}
  >
    📊 View Stats
  </button>
</div>

        
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
  <>
    {/* Active Workouts Section */}
    {workouts.filter(w => !w.is_completed).length > 0 && (
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          📋 Active Workouts 
          <span style={{ background: '#3b82f6', padding: '4px 12px', borderRadius: 20, fontSize: 16 }}>
            {workouts.filter(w => !w.is_completed).length}
          </span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {workouts.filter(w => !w.is_completed).map((workout) => (
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
                  onClick={() => handleMarkComplete(workout)} 
                  style={{ 
                    flex: 1, 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '10px 16px', 
                    borderRadius: 8, 
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 14
                  }}
                >
                  ✓ Mark Complete
                </button>
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
      </div>
    )}

    {/* Completed Workouts Section */}
    {workouts.filter(w => w.is_completed).length > 0 && (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          ✅ Completed Workouts 
          <span style={{ background: '#10b981', padding: '4px 12px', borderRadius: 20, fontSize: 16 }}>
            {workouts.filter(w => w.is_completed).length}
          </span>
        </h2>
        
        <div style={{ display: 'grid', gap: 16 }}>
          {workouts.filter(w => w.is_completed).map((workout) => (
            <div 
              key={workout.id} 
              style={{ 
                background: '#1e3a20', 
                padding: 20, 
                borderRadius: 12, 
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                gap: 20
              }}
            >
              <img 
                src={workout.exercise.image} 
                alt={workout.exercise.name} 
                style={{ 
                  width: 100, 
                  height: 100, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  opacity: 0.9
                }} 
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {workout.exercise.name}
                  </h3>
                  <span style={{ background: '#10b981', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                    ✓ Done
                  </span>
                </div>
                
                <div style={{ fontSize: 14, color: '#d1fae5', marginBottom: 8 }}>
                  Completed on {new Date(workout.completed_date).toLocaleDateString()} at {new Date(workout.completed_date).toLocaleTimeString()}
                </div>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#3b82f6', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                    {workout.exercise.muscle_group}
                  </span>
                  <span style={{ background: '#ef4444', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 'bold' }}>
                    {workout.exercise.difficulty}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#6ee7b7', marginBottom: 4 }}>Duration</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b' }}>{workout.duration_minutes}</div>
                  <div style={{ fontSize: 12, color: '#fbbf24' }}>minutes</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#6ee7b7', marginBottom: 4 }}>Calories</div>
                  <div style={{ fontSize: 28, fontWeight: 'bold', color: '#10b981' }}>🔥 {workout.calories_burned}</div>
                  <div style={{ fontSize: 12, color: '#6ee7b7' }}>burned</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => navigate(`/exercises/${workout.exercise.id}`)} 
                  style={{ 
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
      </div>
    )}

    {/* No workouts message */}
    {workouts.length > 0 && workouts.filter(w => !w.is_completed).length === 0 && workouts.filter(w => w.is_completed).length === 0 && (
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
    )}
  </>
)}

      </div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1f2937',
            padding: 32,
            borderRadius: 16,
            maxWidth: 500,
            width: '90%',
            border: '1px solid #374151'
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              Mark Workout Complete
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: 24 }}>
              {selectedWorkout?.exercise.name}
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 'bold' }}>
                How long did you work out?
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
                min="1"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #374151',
                  background: '#111827',
                  color: 'white',
                  fontSize: 16
                }}
              />
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                💡 Minimum 1 minute. Calories will be calculated automatically based on your profile.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={completing}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #374151',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSubmit}
                disabled={completing}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  border: 'none',
                  background: completing ? '#6b7280' : '#10b981',
                  color: 'white',
                  cursor: completing ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {completing ? 'Completing...' : '✓ Complete Workout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
