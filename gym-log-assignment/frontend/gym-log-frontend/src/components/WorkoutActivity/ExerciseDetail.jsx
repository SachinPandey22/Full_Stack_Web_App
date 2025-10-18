import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/exercises/${id}/`)
      .then(r => r.json())
      .then(setExercise)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18 }}>Loading…</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18 }}>Exercise not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', color: 'white' }}>
      {/* Header */}
      <div style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid #374151', padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: 16, marginBottom: 12 }}
          >
            ← Back to Exercises
          </button>
          <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>{exercise.name}</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ background: '#ef4444', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 'bold' }}>
              {exercise.difficulty || 'Beginner'}
            </span>
            <span style={{ background: '#3b82f6', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 'bold' }}>
              {exercise.muscle_group}
            </span>
            <span style={{ background: '#22c55e', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 'bold' }}>
              {exercise.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Left: Image */}
          <div>
            <div style={{ width: '100%', height: 400, borderRadius: 16, overflow: 'hidden', background: '#374151', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              {exercise.image ? (
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>💪</div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>Description</h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.6 }}>{exercise.description}</p>
            </section>

            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>Equipment</h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.6 }}>{exercise.equipment || 'Bodyweight'}</p>
            </section>

            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>Muscle Group</h3>
              <p style={{ color: '#d1d5db', textTransform: 'capitalize' }}>{exercise.muscle_group}</p>
            </section>

            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>Category</h3>
              <p style={{ color: '#d1d5db', textTransform: 'capitalize' }}>{exercise.category}</p>
            </section>

            {exercise.steps && (
  <section style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>
      📋 How to Perform
    </h3>
    <div style={{ color: '#d1d5db', lineHeight: 1.8 }}>
      {exercise.steps.split('\n').map((step, idx) => (
        <div key={idx} style={{ marginBottom: 8, paddingLeft: 4 }}>
          {step}
        </div>
      ))}
    </div>
  </section>
)}

{exercise.tips && (
  <section style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#f59e0b' }}>
      💡 Tips & Tricks
    </h3>
    <div style={{ 
      background: 'rgba(245, 158, 11, 0.1)', 
      padding: 16, 
      borderRadius: 8, 
      borderLeft: '4px solid #f59e0b',
      color: '#d1d5db',
      lineHeight: 1.6
    }}>
      {exercise.tips.split('•').map((tip, idx) => 
        tip.trim() && <div key={idx} style={{ marginBottom: 4 }}>• {tip.trim()}</div>
      )}
    </div>
  </section>
)}


            {exercise.video && (
              <section style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#60a5fa' }}>Video Demo</h3>
                <video controls src={exercise.video} style={{ width: '100%', borderRadius: 12 }} />
              </section>
            )}

            <div style={{ marginTop: 32 }}>
              <button
                onClick={() => alert('Added to workout plan')}
                style={{
                  background: '#9333ea',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 16,
                  boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => (e.target.style.background = '#7e22ce')}
                onMouseOut={(e) => (e.target.style.background = '#9333ea')}
              >
                Add to Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
