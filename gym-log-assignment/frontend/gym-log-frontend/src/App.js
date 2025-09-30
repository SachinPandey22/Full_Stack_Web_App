import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage'; // import the landing page
import ProfileForm from './components/ProfileForm';
import GymRidePage from './pages/GymRidePage';
import WorkoutLibrary from './components/WorkoutActivity/WorkoutLibrary';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      {/* Public landing page */}
      <Route path="/" element={<GymRidePage />} />

      {/* Public auth pages */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/workout-library" element={<WorkoutLibrary />} />
        {/* Add more protected pages here later */}
        {/* add more protected pages later */}
      </Route>

      {/* Catch-all: if unknown path, send back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

