import React, { useState } from "react";
import { FaTimes, FaComments } from "react-icons/fa";
import "./Chatbot.css";

const responses = {
  "raise complaint": "Go to 'Raise Concern' in your dashboard and fill the form.",
  "check issues": "Check the 'Insights' section to see status.",
  "update profile": "Go to 'Profile' and click Edit to update info.",
  "campuscare": "CampusCare+ is a secure grievance system for students.",
  "library": "Library is open 8 AM – 8 PM, Mon-Sat.",
  "cafeteria": "Cafeteria is open 7 AM – 7 PM.",
  "who can see my issues": "Only Admin and Faculty can view your issues, your privacy is safe."
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm CampusCare Help Bot. Ask me anything.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { text: input, sender: "user" };
    let response = "Sorry, I don't understand that. Please ask something else.";

    // Simple rule-based matching
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
      {/* Floating Chat Icon */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        <FaComments size={24} />
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>CampusCare Help</span>
            <FaTimes className="close-icon" onClick={() => setOpen(false)} />
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

export default Chatbot;
