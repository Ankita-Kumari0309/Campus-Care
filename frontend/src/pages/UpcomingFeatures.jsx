import React from "react";
import "./UpcomingFeatures.css";
import Footer from "../components/Footer";
import { FaClock, FaMobileAlt, FaGlobe, FaBolt } from "react-icons/fa";

const features = [
  {title : "Real-time notifications for issue updates", status: "upcoming"},
  { title: "AI-powered suggestions for faster issue resolution", icon: <FaBolt />, status: "upcoming" },
  { title: "Mobile app integration", icon: <FaMobileAlt />, status: "upcoming" },
  { title: "Multi-language support", icon: <FaGlobe />, status: "upcoming" },
];

const UpcomingFeatures = () => {
  return (
    <div className="upcoming-features-page">
      <div className="features-header">
        <h1>Upcoming Features</h1>
        <p>
          A sneak peek at what we are planning to implement in the future
          to make CampusCare+ even better!
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <span className="feature-status">Coming Soon</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UpcomingFeatures;
