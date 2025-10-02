
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WorkoutLibrary() {
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  const muscleGroups = [
    { id: 'chest', name: 'Chest', color: '#ef4444', emoji: '💪' },
    { id: 'back', name: 'Back', color: '#3b82f6', emoji: '🦾' },
    { id: 'shoulders', name: 'Shoulders', color: '#eab308', emoji: '💪' },
    { id: 'legs', name: 'Legs', color: '#22c55e', emoji: '🦵' },
    { id: 'arms', name: 'Arms', color: '#a855f7', emoji: '💪' },
    { id: 'core', name: 'Core', color: '#f97316', emoji: '🏋️' }
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
              AI Fitness Tracker - Workout Library
            </h1>
            <p style={{ color: '#9ca3af' }}>Select a muscle group to view exercises</p>
          </div>
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
                  background: muscle.color,
                  border: 'none',
                  borderRadius: '16px',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{muscle.emoji}</div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                  {muscle.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                  View Exercises →
                </p>
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
                    style={{
                      background: '#1f2937',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid #374151',
                      transition: 'all 0.3s'
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
                      height: '160px',
                      background: '#374151',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {exercise.video_url ? (
                        <img 
                          src={exercise.video_url} 
                          alt={exercise.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }} 
                        />
                      ) : (
                        <span style={{ fontSize: '48px' }}>💪</span>
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