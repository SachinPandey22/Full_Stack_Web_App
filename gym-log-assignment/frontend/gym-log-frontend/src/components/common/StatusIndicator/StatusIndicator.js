import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ status, message }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return { icon: '✅', className: 'success' };
      case 'error':
        return { icon: '❌', className: 'error' };
      case 'loading':
        return { icon: '🔄', className: 'loading' };
      default:
        return { icon: 'ℹ️', className: 'info' };
    }
  };

  const { icon, className } = getStatusConfig();

  return (
    <div className={`status-indicator ${className}`}>
      <span className="status-icon">{icon}</span>
      <span className="status-message">{message}</span>
    </div>
  );
};

export default StatusIndicator;