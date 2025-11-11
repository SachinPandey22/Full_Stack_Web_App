import React, { useState, useRef, useEffect } from "react";
import "./SearchSupport.css";
import { sendChatMessage, apiClient } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SearchSupport = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hi, I’m Ram, your personal Shaktiman AI assistant. I can help you find your perfect fitness program. Tell me your goals, experience level, or favorite workout style!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const tokenRef = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const { getAccessToken, user } = useAuth();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const resolvedToken =
      typeof getAccessToken === "function" ? getAccessToken() : null;

    tokenRef.current = resolvedToken;

    if (!resolvedToken) {
      setUserInfo({});
      return;
    }

    let ignore = false;

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get("/api/user/profile/", {
          headers: { Authorization: `Bearer ${resolvedToken}` },
        });
        if (!ignore) {
          setUserInfo(res.data || {});
        }
      } catch (error) {
        if (!ignore) {
          setUserInfo({});
        }
      }
    };

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [getAccessToken, user]);

  const handleSend = async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const token =
        tokenRef.current ||
        (typeof getAccessToken === "function" ? getAccessToken() : null);
      tokenRef.current = token;
      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Please log in so I can tailor recommendations to your profile.",
          },
        ]);
        return;
      }
      let profilePayload = userInfo;

      if (!profilePayload || Object.keys(profilePayload).length === 0) {
        try {
          const res = await apiClient.get("/api/user/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          profilePayload = res.data || {};
          setUserInfo(profilePayload);
        } catch (profileErr) {
          if (profileErr?.response?.status === 401) {
            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: "Your session expired. Please log in again so I can keep helping.",
              },
            ]);
            return;
          }
        }
      }

      const res = await sendChatMessage(trimmed, profilePayload || {}, token);
      setMessages((prev) => [...prev, { sender: "bot", text: res.reply }]);
    } catch (err) {
      const status = err?.response?.status;
      const fallback =
        status === 401
          ? "Your session expired. Please log in again so I can keep helping."
          : "⚠️ Sorry, I’m having trouble reaching the AI right now. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: fallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-support-chat">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
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
        <div ref={chatEndRef} />
      </div>

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
