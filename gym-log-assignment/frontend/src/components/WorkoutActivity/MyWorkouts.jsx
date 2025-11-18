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
  const [balanceFilter, setBalanceFilter] = useState('week');
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
  const calculateMuscleBalance = (filter = 'week') => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let completedWorkouts = workouts.filter(w => w.is_completed);
    if (filter === 'week') {
      completedWorkouts = completedWorkouts.filter(w => 
        new Date(w.completed_date) >= oneWeekAgo
      );
    }
    
    const muscleGroups = {};
    completedWorkouts.forEach(workout => {
      const muscle = workout.exercise.muscle_group;
      const workoutDate = new Date(workout.completed_date);
      
      if (!muscleGroups[muscle]) {
        muscleGroups[muscle] = {
          count: 0,
          lastWorked: workoutDate,
          calories: 0
        };
      }
      
      muscleGroups[muscle].count += 1;
      muscleGroups[muscle].calories += workout.calories_burned || 0;
      
      if (workoutDate > muscleGroups[muscle].lastWorked) {
        muscleGroups[muscle].lastWorked = workoutDate;
      }
    });
    
    const totalWorkouts = completedWorkouts.length;
    
    const muscleArray = Object.entries(muscleGroups)
      .map(([muscle, data]) => ({
        muscle,
        count: data.count,
        percentage: totalWorkouts > 0 ? Math.round((data.count / totalWorkouts) * 100) : 0,
        lastWorked: data.lastWorked,
        daysSince: Math.floor((now - data.lastWorked) / (1000 * 60 * 60 * 24)),
        calories: Math.round(data.calories)
      }))
      .sort((a, b) => b.count - a.count);
    
    const maxCount = muscleArray.length > 0 ? muscleArray[0].count : 1;
    const avgCount = totalWorkouts / (muscleArray.length || 1);
    const underworked = muscleArray.filter(m => m.count < avgCount * 0.5);
    
    return { muscleArray, maxCount, totalWorkouts, underworked, avgCount };
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

        
        {workouts.filter(w => w.is_completed).length > 0 && (() => {
          const { muscleArray, maxCount, totalWorkouts, underworked, avgCount } = calculateMuscleBalance(balanceFilter);
          
          return (
            <div style={{ background: '#1f2937', padding: 24, borderRadius: 12, border: '1px solid #374151', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 'bold' }}> Muscle Group Balance</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setBalanceFilter('week')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: balanceFilter === 'week' ? '#9333ea' : '#374151', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>This Week</button>
                  <button onClick={() => setBalanceFilter('all')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: balanceFilter === 'all' ? '#9333ea' : '#374151', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 'bold' }}>All Time</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 12, background: '#111827', borderRadius: 8 }}>
                <div><span style={{ fontSize: 12, color: '#9ca3af' }}>Total: </span><span style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{totalWorkouts} workouts</span></div>
                <div><span style={{ fontSize: 12, color: '#9ca3af' }}>Groups: </span><span style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{muscleArray.length}</span></div>
                <div><span style={{ fontSize: 12, color: '#9ca3af' }}>Avg: </span><span style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{avgCount.toFixed(1)} per group</span></div>
              </div>
              
              {muscleArray.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Complete some workouts to see your muscle group balance!</p>
              ) : (
                <>
                  <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
                    {muscleArray.map(({ muscle, count, percentage, daysSince, calories }) => {
                      const barPercentage = (count / maxCount) * 100;
                      const isLow = count < avgCount * 0.5;
                      return (
                        <div key={muscle}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>{muscle}</span>
                              {isLow && <span style={{ fontSize: 16 }}>⚠️</span>}
                            </div>
                            <div style={{ fontSize: 13, color: '#9ca3af', textAlign: 'right' }}>
                              <div>{count} ({percentage}%)</div>
                              <div style={{ fontSize: 11 }}>Last: {daysSince === 0 ? 'Today' : `${daysSince}d ago`}</div>
                            </div>
                          </div>
                          <div style={{ background: '#111827', borderRadius: 6, height: 10, overflow: 'hidden', border: '1px solid #374151' }}>
                            <div style={{ background: isLow ? '#f59e0b' : daysSince > 7 ? '#ef4444' : '#10b981', height: '100%', width: `${barPercentage}%`, borderRadius: 6, transition: 'width 0.3s ease' }} />
                          </div>
                          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{calories} calories burned</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {underworked.length > 0 && (
                    <div style={{ padding: 16, background: '#7c2d12', borderRadius: 8, border: '1px solid #f59e0b', marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: '#fed7aa', marginBottom: 10 }}>⚠️ Recommended Actions:</div>
                      {underworked.map(({ muscle, count }) => {
                        const needed = Math.ceil(avgCount - count);
                        return (
                          <div key={muscle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13, color: '#fed7aa' }}>
                            <span>• Add {needed} more {muscle} workout{needed !== 1 ? 's' : ''}</span>
                            <button onClick={() => navigate('/workout-library')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 'bold' }}>+ Browse {muscle} →</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div style={{ padding: 12, background: '#1e3a8a', borderRadius: 8, border: '1px solid #3b82f6' }}>
                    <div style={{ fontSize: 13, color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>💡</span>
                      <span><strong>Tip:</strong> Aim for {Math.ceil(avgCount)} workouts per muscle group for balanced development</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })()}
        

        


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
