import React from 'react';
import { useNavigate } from 'react-router-dom';

function NutritionCard() {
  const navigate = useNavigate();

  const openNutrition = () => {
    navigate('/nutrition');
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
        background: '#16a34a', // green
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '32px' }} role="img" aria-label="apple">🍎</span>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
        Nutrition
      </h3>
      <p style={{ color: '#666', marginBottom: '24px', padding: '0 16px' }}>
        See your daily calorie target and macro split based on your profile
      </p>
      <button
        onClick={openNutrition}
        style={{
          background: '#16a34a',
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
        onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
        onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
        aria-label="Open Nutrition"
        title="Open Nutrition"
      >
        Open Nutrition
      </button>
    </div>
  );
}

export default NutritionCard;