import React from 'react';
import Header from './components/layout/Header/Header';
import BackendTest from './components/test/BackendTest/BackendTest';
import ApiTest from './components/test/ApiTest/ApiTest';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <Header 
          title="🏋️‍♂️ Gym Log React Frontend"
          subtitle="Testing connection with Django backend"
        />
        
        <div className="test-section">
          <BackendTest />
          <ApiTest />
        </div>
        
        <div className="instructions">
          <h3>📋 Status</h3>
          <ul>
            <li>✅ React frontend is running</li>
            <li>✅ Component structure is organized</li>
            <li>✅ API service is configured</li>
            <li>⏳ Testing backend connection...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;