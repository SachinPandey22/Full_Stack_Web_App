import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';



export default function LandingPage() {

  const DarkPrimaryBlue = "#0337c8ff";
  const LightPrimaryBlue = "#007bff";

  return (
    <div
      style={{ 
        backgroundImage: 'url("/landing_page.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // full page height
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* Navbar */}
      <nav style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'right',
        padding: '20px 20px',
        background: DarkPrimaryBlue,
        borderBottom: '1px solid #ccc'
      }}>
        <div/>

        <Link
    to='url("/ai_fitness_header_logo.png")'
    style={{
      justifySelf: 'center',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      textDecoration: 'none',
      color: 'inherit',
    }}
  >
    <img
      src="/ai_fitness_header_logo.png"     // <-- your logo path here
      alt="SHAKTIMAN"
      style={{ height: 70, width: 'auto', display: 'block' }}
    />

  </Link>
        {/* Right actions */}
        <div style={{ justifySelf: 'end', display: 'flex', gap: 12 }}>
  <Link to="/login" className="btn btn--ghost">Login</Link>
  <Link to="/register" className="btn btn--primary">Sign Up</Link>
</div>
      </nav>

      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          background: LightPrimaryBlue, // a bit darker than brand
          color: '#ffffff',
          fontSize: 14,
          letterSpacing: 0.3,
        }}
      >
        {/* Left links */}
        <div style={{ display: 'flex', gap: '50px', alignItems:'center'}}>
          <a href="#overview">Overview</a>|
          <a href="#workouts">Workouts</a>|
          <a href="#ai">AI Panel</a>|
          <a href="#quick">Quick Actions</a>
        </div>
    
      </div>

      {/* Landing content */}
      <div style={{ flex: 1, padding: '40px', textAlign: 'center', color: "blue", textShadow: "1px 1px 1px rgba(0,0,0,0.6)" }}>
        <h1>Welcome to Your Fitness Tracker</h1>
        <p>Track workouts, meals, and progress with AI insights.</p>
        <Link to="/register">
          <button style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '6px',
            background: LightPrimaryBlue,
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
