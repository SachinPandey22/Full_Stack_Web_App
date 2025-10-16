import React, { useState } from "react";
import "./ChatPopup.css";
import AIPanel from "./AIPanel";

const ChatPopup = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="chat-button" onClick={() => setOpen(!open)}>
        💬 Chat with Support
      </button>

      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            <span>AI Support</span>
            <button className="close-btn" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-body">
            <AIPanel />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
