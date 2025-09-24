import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GymRidePage from "./pages/GymRidePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GymRidePage />} />
      </Routes>
    </Router>
  );
}

export default App;
