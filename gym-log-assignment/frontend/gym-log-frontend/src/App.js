// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from './routes/ProtectedRoute';
// import Login from './pages/Login';
// import Register from './pages/Register';
// //import Dashboard from './pages/Dashboard';
// import GymRidePage from './pages/GymRidePage';

// // function App() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Navigate to="/dashboard" replace />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/register" element={<Register />} />

// //       <Route element={<ProtectedRoute />}>
// //         <Route path="/dashboard" element={<Dashboard />} />
// //         {/* add more protected pages later */}
// //       </Route>

// //       <Route path="*" element={<Navigate to="/dashboard" replace />} />
// //     </Routes>
// //   );
// // }

// //export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import GymRidePage from './pages/GymRidePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<GymRidePage />} />

      {/* Public auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more protected pages here later */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
