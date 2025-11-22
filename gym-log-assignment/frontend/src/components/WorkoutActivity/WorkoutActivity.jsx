// src/components/WorkoutActivity/WorkoutActivity.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';


const DarkPrimaryBlue = "#0337c8ff";
const LightPrimaryBlue = "#007bff";

const previewMuscles = [
  {
    id: 'chest',
    name: 'Chest',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
  },
  {
    id: 'back',
    name: 'Back',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400',
  },
  {
    id: 'core',
    name: 'Core',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
  },
];

function WorkoutActivity() {
  const navigate = useNavigate();

  const openWorkoutLibrary = () => {
    navigate('/workout-library');
  };

  const pillButtonStyle = {
  padding: '6px 16px',
  borderRadius: 999,
  border: '1px solid rgba(15,23,42,0.15)',
  background: LightPrimaryBlue,
  color: '#ffffff',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 16,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            color: '#111827',
          }}
        >
          Workout library
        </h3>

        <button
          onClick={openWorkoutLibrary}
          style={pillButtonStyle}
        >
          View all
        </button>
      </div>

      {/* Preview tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 15,
          flex: 1,
        }}
      >
        {previewMuscles.map((muscle) => (
          <div
            key={muscle.id} 
            style={{
              background: 'transparent',
              borderRadius: 16,
              border: 'none',
              padding: 0,
              boxShadow: '0 6px 14px rgba(15,23,42,0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
            }}
          >
            {/* image */}
            <img
              src={muscle.image}
              alt={muscle.name}
              style={{
                width: '100%',
                height: 150,
                objectFit: 'cover',
              }}
            />

            {/* bottom pill button-style label */}
            <div
              style={{
                padding: '16px 12px 20px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={openWorkoutLibrary}
                style={pillButtonStyle}
              >
                {muscle.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutActivity;
