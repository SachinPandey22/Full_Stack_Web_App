import React, { useState, useRef, useEffect } from "react";
import "./SearchSupport.css";
import { sendChatMessage } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getDaysSince } from "../../utils/dateUtils";
import "../../styles/profileUpdate.css";

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
  const { getAccessToken, user, profile, refreshProfile, isProfileLoading, profileUpdatedAt } = useAuth();
  const prevProfileRef = useRef(null);
  const navigate = useNavigate();
  const daysSinceUpdate = getDaysSince(profileUpdatedAt);
  const profileNeedsUpdate = typeof daysSinceUpdate === "number" && daysSinceUpdate >= 14;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!profile) {
      prevProfileRef.current = null;
      return;
    }
    const prev = prevProfileRef.current;
    const changed = prev && JSON.stringify(prev) !== JSON.stringify(profile);
    if (changed) {
      toast.success("🤖 Your suggestions are updated!");
    }
    prevProfileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    const resolvedToken =
      typeof getAccessToken === "function" ? getAccessToken() : null;
    tokenRef.current = resolvedToken;

    if (!resolvedToken) {
      setUserInfo({});
      return;
    }

    if (profile) {
      setUserInfo(profile);
      return;
    }

    let ignore = false;
    refreshProfile()
      .then((data) => {
        if (!ignore && data) {
          setUserInfo(data);
        }
      })
      .catch(() => {
        if (!ignore) setUserInfo({});
      });

    return () => {
      ignore = true;
    };
  }, [getAccessToken, user, profile, refreshProfile]);

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
          const refreshed = await refreshProfile();
          profilePayload = refreshed || {};
          if (profilePayload) {
            setUserInfo(profilePayload);
          }
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
      {profileUpdatedAt && (
        <div className="text-[10px] text-gray-400">
          Profile updated at {profileUpdatedAt.toLocaleTimeString()}
        </div>
      )}
      {profileNeedsUpdate && (
        <div className="chat-warning-banner">
          <div>
            ⚠️ Your profile hasn’t been updated in {daysSinceUpdate} days.
            <br />
            Suggestions may not be accurate.
          </div>
          <button
            type="button"
            className="update-btn"
            onClick={() => navigate("/profile")}
          >
            Update Now
          </button>
        </div>
      )}
      {isProfileLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
          <span className="spinner" style={{ width: 12, height: 12 }} aria-hidden="true" />
          <span>Syncing latest profile...</span>
        </div>
      )}
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
