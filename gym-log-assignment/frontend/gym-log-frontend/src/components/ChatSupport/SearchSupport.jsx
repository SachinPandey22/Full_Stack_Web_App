import React, { useState, useRef, useEffect } from "react";
import "./SearchSupport.css";
import { sendChatMessage } from "../../services/api";

const SearchSupport = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);  
  const chatEndRef = useRef(null);


  // scrolls to bottom when new message arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, ]);

  // Handle sending user message and receiving AI response
  const handleSend = async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    // ✅ Auto expand if chat is collapsed
    if (!expanded) setExpanded(true);

    // Add user's message to chat
    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send message to backend (OpenAI-connected endpoint)
      const res = await sendChatMessage(trimmed);

      // Add AI response to chat
      setMessages(prev => [...prev, { sender: "bot", text: res.reply }]);
      if (!expanded) setExpanded(true);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I’m having trouble reaching the AI right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-support-chat">
      {/* Chat Window */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="empty-text">Start a conversation 👇</p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`msg ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div className="msg bot loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !inputMessage.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default SearchSupport;