import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#f0f2f5',
        borderBottom: '1px solid #ccc'
      }}>
        {/* Left links */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="#overview">Overview</a>
          <a href="#workouts">Workouts</a>
          <a href="#ai">AI Panel</a>
          <a href="#quick">Quick Actions</a>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </nav>

      {/* Landing content */}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Welcome to Your Fitness Tracker</h1>
        <p>Track workouts, meals, and progress with AI insights.</p>
        <Link to="/register">
          <button style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '6px',
            background: '#007bff',
            color: '#fff',
            border: 'none'
          }}>
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
