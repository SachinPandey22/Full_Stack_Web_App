// ============================================
// FILE 1: WorkoutActivity.jsx
// Location: frontend/frontend-log-assignment/src/components/WorkoutActivity.jsx
// This creates a button in your dashboard that opens the workout library
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkoutActivity() {
  const navigate = useNavigate();

  const openWorkoutLibrary = () => {
    navigate('/workout-library');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        background: '#9333ea',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '32px' }}>💪</span>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
        Workout Library
      </h3>
      <p style={{ color: '#666', marginBottom: '24px', padding: '0 16px' }}>
        Browse exercises by muscle group and build your perfect workout routine
      </p>
      <button
        onClick={openWorkoutLibrary}
        style={{
          background: '#9333ea',
          color: 'white',
          fontWeight: 'bold',
          padding: '12px 32px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'all 0.3s',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => e.target.style.background = '#7e22ce'}
        onMouseOut={(e) => e.target.style.background = '#9333ea'}
      >
        Open Workout Library
      </button>
    </div>
  );
}

export default WorkoutActivity;