// src/components/Footer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logoicon.png"; // 👈 your logo image
import { FaComments, FaTimes } from "react-icons/fa";

const responses = {
  "raise complaint": "Go to 'Raise Concern' in your dashboard and fill the form.",
  "check issues": "Check the 'Insights' section to see status.",
  "update profile": "Go to 'Profile' and click Edit to update info.",
  "campuscare": "CampusCare+ is a secure grievance system for students.",
  "library": "Library is open 8 AM – 8 PM, Mon-Sat.",
  "cafeteria": "Cafeteria is open 7 AM – 7 PM.",
  "who can see my issues": "Only Admin and Faculty can view your issues, your privacy is safe."
};

const Footer = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm CampusCare Help Bot. Ask me anything.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const goToUpcomingFeatures = () => {
    navigate("/upcoming-features");
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    let response = "Sorry, I don't understand that. Please ask something else.";

    const query = input.toLowerCase();
    for (let key in responses) {
      if (query.includes(key)) {
        response = responses[key];
        break;
      }
    }

    const botMessage = { text: response, sender: "bot" };
    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">

          {/* Left: Logo + Name + Upcoming Features */}
          <div className="footer-brand">
            <img src={logo} alt="CampusCare Logo" className="footer-logo" />
            <h3>CampusCare+</h3>
            <p>
              A secure and transparent grievance resolution platform
              designed for safer and more accountable campuses.
            </p>

            {/* Upcoming Features button */}
            <button 
              className="footer-upcoming-btn" 
              onClick={goToUpcomingFeatures}
            >
              Upcoming Features
            </button>
          </div>

          {/* Right: Credits */}
          <div className="footer-credits">
            <p>
              Hackathon Project by <strong>Team Byte Force</strong><br />
              <span className="sub-team"> Genesis : A CodeFest</span>
            </p>

            <p className="powered">
              Powered by <span>Greenbeam</span>
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          © 2026 BIT Mesra · Campus Grievance System
        </div>
      </footer>

      {/* Floating Chat Icon */}
      <div className="chat-icon" onClick={() => setChatOpen(!chatOpen)}>
        <FaComments size={24} />
      </div>

      {/* Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>CampusCare Help</span>
            <FaTimes className="close-icon" onClick={() => setChatOpen(false)} />
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
