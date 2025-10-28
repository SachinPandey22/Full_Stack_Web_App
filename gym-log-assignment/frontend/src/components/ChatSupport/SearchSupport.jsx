import React, { useState } from "react";
import "./SearchSupport.css";

const SearchSupport = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text: inputMessage }]);

    // Clear input
    setInputMessage("");

    // Add auto reply after short delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Working on this feature — reply coming soon 😊" }
      ]);
    }, 700);
  };

  return (
    <div className="search-support-chat">
      {/* Chat Display */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="empty-text">Start a conversation 👇</p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "msg user" : "msg bot"}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input + Send */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default SearchSupport;
