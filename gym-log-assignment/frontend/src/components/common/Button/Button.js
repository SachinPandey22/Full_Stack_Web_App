import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  loading = false 
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`btn btn-${variant} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;