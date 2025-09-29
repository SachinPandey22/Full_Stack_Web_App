import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div
      style={{
        backgroundImage: `url("/ai_fitness.png")`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // full page height
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: "rgba(240, 242, 245, 0.8)",
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
      <div style={{ flex: 1, padding: '40px', textAlign: 'center', color: "blue", textShadow: "1px 1px 1px rgba(0,0,0,0.6)" }}>
        <h1>Welcome to Your Fitness Tracker</h1>
        <p>Track workouts, meals, and progress with AI insights.</p>
        <Link to="/register">
          <button style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '6px',
            background: '#007bff',
            color: '#f3ebebff',
            border: 'none',
            cursor: 'pointer',
          }}>
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
