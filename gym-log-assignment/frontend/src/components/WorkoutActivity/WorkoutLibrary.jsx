
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WorkoutLibrary() {
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const muscleGroups = [
    { 
      id: 'chest', 
      name: 'Chest', 
      color: '#ef4444', 
      emoji: '💪',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
    },
    { 
      id: 'back', 
      name: 'Back', 
      color: '#3b82f6', 
      emoji: '🦾',
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400'
    },
    { 
      id: 'shoulders', 
      name: 'Shoulders', 
      color: '#eab308', 
      emoji: '💪',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'
    },
    { 
      id: 'legs', 
      name: 'Legs', 
      color: '#22c55e', 
      emoji: '🦵',
      image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400'
    },
    { 
      id: 'arms', 
      name: 'Arms', 
      color: '#a855f7', 
      emoji: '💪',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'
    },
    { 
      id: 'core', 
      name: 'Core', 
      color: '#f97316', 
      emoji: '🏋️',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    }
];


  const fetchExercises = async (muscleGroup) => {
    setLoading(true);
    try {
      // Replace with your Django backend URL
      const response = await fetch(`http://127.0.0.1:8000/api/exercises/?muscle_group=${muscleGroup}`);
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Demo data for testing without backend
      setExercises([
        { id: 1, name: 'Push-ups', muscle_group: muscleGroup, description: 'Classic chest exercise', video_url: null },
        { id: 2, name: 'Bench Press', muscle_group: muscleGroup, description: 'Build chest strength', video_url: null },
        { id: 3, name: 'Dumbbell Flyes', muscle_group: muscleGroup, description: 'Isolate chest muscles', video_url: null }
      ]);
    }
    setLoading(false);
  };

  const handleMuscleClick = (muscleId) => {
    setSelectedMuscle(muscleId);
    fetchExercises(muscleId);
  };

  const handleBack = () => {
    setSelectedMuscle(null);
    setExercises([]);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        borderBottom: '1px solid #374151',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              SHAKTIMAN - Workout Library
            </h1>
            <p style={{ color: '#9ca3af' }}>Select a muscle group to view exercises</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
  <button
    onClick={() => navigate('/my-workouts')}
    style={{
      background: '#3b82f6',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background 0.3s'
    }}
    onMouseOver={(e) => e.target.style.background = '#2563eb'}
    onMouseOut={(e) => e.target.style.background = '#3b82f6'}
  >
    📋 My Workouts
  </button>
  
  <button
    onClick={goToDashboard}
    style={{
      background: '#9333ea',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background 0.3s'
    }}
    onMouseOver={(e) => e.target.style.background = '#7e22ce'}
    onMouseOut={(e) => e.target.style.background = '#9333ea'}
  >
    🏠 Back to Dashboard
  </button>
</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>
        {!selectedMuscle ? (
          /* Muscle Group Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            

            {muscleGroups.map((muscle) => (
  <button
    key={muscle.id}
    onClick={() => handleMuscleClick(muscle.id)}
    style={{
      background: `linear-gradient(135deg, ${muscle.color}dd, ${muscle.color}aa)`,
      border: 'none',
      borderRadius: '16px',
      padding: '0',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden',
      height: '280px'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    }}
  >
    {/* Background Image */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${muscle.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.3,
      zIndex: 0
    }} />
    
    {/* Content Overlay */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      padding: '32px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textAlign: 'left'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{muscle.emoji}</div>
      <h3 style={{ 
        fontSize: '28px', 
        fontWeight: 'bold', 
        color: 'white', 
        marginBottom: '8px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        {muscle.name}
      </h3>
      <p style={{ 
        fontSize: '14px', 
        color: 'rgba(255,255,255,0.95)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        View Exercises →
      </p>
    </div>
  </button>
))}

          </div>
        ) : (
          /* Exercise List View */
          <div>
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Back to Muscle Groups
            </button>

            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', textTransform: 'capitalize' }}>
              {selectedMuscle} Exercises
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid rgba(96, 165, 250, 0.3)',
                  borderTop: '4px solid #60a5fa',
                  borderRadius: '50%',
                  margin: '0 auto',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {exercises.map((exercise) => (
  <div
    key={exercise.id}
    onClick={() => navigate(`/exercises/${exercise.id}`)}
    style={{
      background: '#1f2937',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #374151',
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.borderColor = '#60a5fa';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.borderColor = '#374151';
    }}
  >

                  
                   
                    
                    <div style={{
  width: '100%',
  height: '200px',
  background: '#374151',
  borderRadius: '8px',
  marginBottom: '16px',
  overflow: 'hidden',
  position: 'relative'
}}>
  {exercise.image ? (
    <img 
      src={exercise.image} 
      alt={exercise.name} 
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  ) : (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #374151, #1f2937)'
    }}>
      <span style={{ fontSize: '48px' }}>💪</span>
    </div>
  )}
</div>

                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {exercise.name}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutLibrary;