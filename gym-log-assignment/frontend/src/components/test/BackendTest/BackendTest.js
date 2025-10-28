import React, { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import StatusIndicator from '../../common/StatusIndicator/StatusIndicator';
import { apiService } from '../../../services/api';
import './BackendTest.css';

const BackendTest = () => {
  const [status, setStatus] = useState('info');
  const [message, setMessage] = useState('Testing backend connection...');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('loading');
    setMessage('Testing backend connection...');

    const result = await apiService.testBackendConnection();

    if (result.success) {
      setStatus('success');
      setMessage('Backend connection successful!');
    } else {
      setStatus('error');
      setMessage(`Backend connection failed: ${result.error}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="backend-test">
      <h2>Backend Connection Test</h2>
      <StatusIndicator status={status} message={message} />
      <Button 
        onClick={testConnection} 
        loading={loading}
        variant="primary"
      >
        Test Backend
      </Button>
    </div>
  );
};

export default BackendTest;