import React, { useState } from "react";
import "./ChatPopup.css";
import { useNavigate } from "react-router-dom";


const ChatPopup = () => {
  const [open, setOpen] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const navigate = useNavigate();



  const handleSendMessage = async () => {
  const email = document.querySelector(".email-input").value;
  const message = document.querySelector(".message-input").value;

  if (!email || !message) {
    alert("Please fill in both fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/contact/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    if (response.ok) {
      alert("✅ Message sent! We'll get back to you soon.");
    } else {
      alert("❌ Failed to send message. Please try again.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <>
      {/* Floating Chat Button */}
      <button className="chat-button" onClick={() => setOpen(!open)}>
        💬 
      </button>

      {/* Popup Panel */}
      {open && (
        <div className="chat-popup">
          <div className="chat-topbar">
            <div className="brand">
              <img src="/logo192.png" alt="Shaktiman" className="brand-logo" />
              <span className="brand-name">Shaktiman</span>
            </div>
            <button className="close-btn" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          {!showMessageForm ? (
            <div className="chat-content">
              <h2>Hi there,</h2>
              <h3>How can we help?</h3>
              <div
                className="message-card"
                onClick={() => setShowMessageForm(true)}
              >
                <div>
                  <strong>Send us a message</strong>
                  <p>We typically reply in a few hours</p>
                </div>
                <button className="message-arrow">➤</button>
              </div>
              <div className="search-box">
                <input type="text" placeholder="Search for help" />
              </div>
              <div className="help-links">
                <p
                  className="link"
                  onClick={() => {
                    setOpen(false);  // Close chat popup
                    navigate('/profile'); // Navigate to FAQ page
                  }}
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
              
                >
                  
                Update your profile ➜
                </p>
              </div>
            </div>
          ) : (
            // Message form content
            <div className="message-form">
              <h3>Send us a message 💬</h3>
              <p>
                Ask us anything or share feedback. We'll get back to you soon!
              </p>
              <input
                type="email"
                className="email-input"
                placeholder="email@example.com"
              />
              <textarea
                className="message-input"
                placeholder="Message..."
              ></textarea>
              <div className="form-actions">
                <button
                  className="back-btn"
                  onClick={() => setShowMessageForm(false)}
                >
                  ← Back
                </button>
                <button className="send-btn"
                  onClick={handleSendMessage}
                >
                  ➤
                </button>
              </div>
            </div>
          )}


          <div className="chat-footer">
            <button className="footer-btn active">🏠 Home</button>
            <button className="footer-btn">💬 Messages</button>
            <button className="footer-btn">❓ Help</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
