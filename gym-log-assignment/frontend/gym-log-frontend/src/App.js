import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage'; // import the landing page
import ProfileForm from './components/ProfileForm';
import WorkoutLibrary from './components/WorkoutActivity/WorkoutLibrary';
import ExerciseDetail from './components/WorkoutActivity/ExerciseDetail';
import NutritionPage from './components/Nutrition/NutritionPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Public auth pages */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/workout-library" element={<WorkoutLibrary />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        {/* add more protected pages later */}
      </Route>

      {/* Catch-all: if unknown path, send back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

