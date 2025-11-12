import React, { useState } from "react";
import "./ChatPopup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import SearchSupport from "./SearchSupport";



const ChatPopup = () => {
  const [open, setOpen] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const rawName = typeof profile?.name === "string" ? profile.name : "";
  const trimmedName = rawName.trim();
  const firstName = trimmedName ? trimmedName.split(/\s+/)[0] : "there";



  const handleSendMessage = async () => {
  const email = document.querySelector(".email-input").value;
  const message = document.querySelector(".message-input").value;

  if (!email || !message) {
    alert("Please fill in both fields!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/support/contact/", {
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
            <button
              className="close-btn"
              onClick={() => {
                setShowAIChat(false);
                setShowMessageForm(false);
                setOpen(false);
              }}
            >
              ×
            </button>
          </div>

          {showAIChat ? (
            <div className="message-form">
              <SearchSupport />
              <div className="form-actions">
                <button className="back-btn" onClick={() => setShowAIChat(false)}>
                  ← Back
                </button>
              </div>
            </div>
          ) : showMessageForm ? (
            <div className="message-form">
              <h3>Send us a message 💬</h3>
              <p>Ask us anything or share feedback. We'll get back to you soon!</p>
              <input type="email" className="email-input" placeholder="email@example.com" />
              <textarea className="message-input" placeholder="Message..."></textarea>
              <div className="form-actions">
                <button className="back-btn" onClick={() => setShowMessageForm(false)}>
                  ← Back
                </button>
                <button className="send-btn" onClick={handleSendMessage}>
                  ➤
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-content">
              <h2>Hi {firstName},</h2>
              <h3>How can we help?</h3>
              <div className="message-card" onClick={() => setShowMessageForm(true)}>
                <div>
                  <strong>Send us a message</strong>
                  <p>We typically reply in a few hours</p>
                </div>
                <button className="message-arrow">➤</button>
              </div>
              <div className="message-card" onClick={() => setShowAIChat(true)}>
                <div>
                  <strong>Start a conversation</strong>
                  <p>Chat with Ram, your virtual assistant</p>
                </div>
                <button className="message-arrow">💬</button>
              </div>
              <div className="help-links">
                <p
                  className="link"
                  onClick={() => {
                    setOpen(false);
                    navigate('/profile');
                  }}
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                >
                  Update your profile ➜
                </p>
                <p
                  className="link"
                  onClick={() => {
                    setOpen(false);
                    navigate('/workout-library');
                  }}
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                >
                  Add a workout ➜
                </p>
                <p
                  className="link"
                  onClick={() => {
                    setOpen(false);
                    navigate('/MealLogging');
                  }}
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                >
                  Add a meal ➜
                </p>
                <p
                  className="link"
                  onClick={() => {
                    setOpen(false);
                    navigate('/nutrition');
                  }}
                  style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
                >
                  View nutrition tips ➜
                </p>
              </div>
            </div>
          )}

          <div className="chat-footer">
          
            <button 
              className="footer-btn active"           
              onClick={() => navigate('/Dashboard')}
            >
              🏠 Home
              </button>

            <button className="footer-btn">💬 Messages</button>
            <button className="footer-btn">❓ Help</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
