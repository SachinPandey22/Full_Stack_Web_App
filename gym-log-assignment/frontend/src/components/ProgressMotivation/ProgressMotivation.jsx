// src/components/ProgressMotivation/ProgressMotivation.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://127.0.0.1:8000/api/my-workouts/';

export default function ProgressMotivation() {
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      if (!token) {
        setWorkouts([]);
        return;
      }

      const resp = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        console.error('Failed to load workouts', resp.status);
        setWorkouts([]);
        return;
      }

      const data = await resp.json();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading workouts in ProgressMotivation:', err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // newest 5, stacked
  const lastFive = [...workouts]
    .sort(
      (a, b) =>
        new Date(b.created_at || b.id) - new Date(a.created_at || a.id)
    )
    .slice(0, 5);

  const goToMyWorkouts = () => navigate('/my-workouts');

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 12,
        background: 'transparent',
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
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
          My Workouts
        </h3>

        <button
          type="button"
          onClick={goToMyWorkouts}
          style={{
            padding: '6px 18px',
            borderRadius: 999,
            border: 'none',
            background: '#3b82f6',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
          }}
        >
          View All
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: '#6b7280',
          }}
        >
          Loading workouts…
        </div>
      ) : lastFive.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 8,
            fontSize: 13,
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: 32 }}>💪</div>
          <div>No workouts saved yet.</div>
          <button
            type="button"
            onClick={goToMyWorkouts}
            style={{
              marginTop: 6,
              padding: '8px 18px',
              borderRadius: 999,
              border: 'none',
              background: '#3b82f6',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Go to My Workouts
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 4,
            overflowY: 'auto',
          }}
        >
          {lastFive.map((workout) => (
            <div
              key={workout.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 10,
                borderRadius: 10,
                background: 'transparent',
                boxShadow: '0 2px 6px rgba(15,23,42,0.08)',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#e5e7eb',
                  flexShrink: 0,
                }}
              >
                <img
                  src={workout.exercise?.image}
                  alt={workout.exercise?.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Name + attributes */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {workout.exercise?.name || 'Workout'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  {workout.exercise?.muscle_group && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 600,
                      }}
                    >
                      {workout.exercise.muscle_group}
                    </span>
                  )}
                  {workout.exercise?.difficulty && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: '#fee2e2',
                        color: '#b91c1c',
                        fontWeight: 600,
                      }}
                    >
                      {workout.exercise.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* View details button */}
              {workout.exercise?.id && (
                <button
                  type="button"
                  onClick={() => navigate(`/exercises/${workout.exercise.id}`)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: 'none',
                    background: '#3b82f6',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  View Details
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
