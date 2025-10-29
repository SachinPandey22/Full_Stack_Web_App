import React, { useState } from 'react';
import Button from '../../common/Button/Button';
import StatusIndicator from '../../common/StatusIndicator/StatusIndicator';
import { apiService } from '../../../services/api';
import './ApiTest.css';

const ApiTest = () => {
  const [status, setStatus] = useState('info');
  const [message, setMessage] = useState('Click button to test API endpoint');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setStatus('loading');
    setMessage('Testing API endpoint...');
    setApiData(null);

    const result = await apiService.testApiEndpoint();

    if (result.success) {
      setStatus('success');
      setMessage('API endpoint working!');
      setApiData(result.data);
    } else {
      setStatus('error');
      setMessage(`API test failed: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="api-test">
      <h2>API Endpoint Test</h2>
      <StatusIndicator status={status} message={message} />
      
      <Button 
        onClick={testApi} 
        loading={loading}
        variant="primary"
      >
        Test API
      </Button>

      {apiData && (
        <div className="api-response">
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;