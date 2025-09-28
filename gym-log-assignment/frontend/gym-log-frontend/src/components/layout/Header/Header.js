import React from 'react';
import './Header.css';

const Header = ({ title, subtitle }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
  );
};

export default Header;