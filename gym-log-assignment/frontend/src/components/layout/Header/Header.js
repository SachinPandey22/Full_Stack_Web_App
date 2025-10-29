import React from 'react';
import './Header.css';
import ChatPopup from "../AIPanel/ChatPopup";


const Header = ({ title, subtitle }) => {
  return (
  <>
      <header className="app-header">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>

      {/* Chat button visible on every page with header */}
      <ChatPopup />
    </>
  );
};


export default Header;