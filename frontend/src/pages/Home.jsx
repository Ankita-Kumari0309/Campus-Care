// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Home.css";
import { FiUser, FiShield, FiTrendingUp, FiBook } from "react-icons/fi";

const Home = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div id="home">
      {/* Navbar gets theme from App */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>
            CampusCare<span className="plus">+</span>
          </h1>

          <p className="hero-subtitle">
            A centralized, secure, and transparent grievance resolution platform
            built to protect students, empower faculty, and ensure accountability
            across campuses.
          </p>

          <button
            className="get-started-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

        <div className="hero-icons">
          <FiUser className="hero-icon" />
          <FiShield className="hero-icon" />
          <FiTrendingUp className="hero-icon" />
          <FiBook className="hero-icon" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>Why CampusCare+</h2>

        <p className="about-intro">
          Campuses need more than just complaint boxes. CampusCare+ transforms
          how issues are reported, tracked, and resolved — ensuring safety,
          transparency, and trust for every stakeholder.
        </p>

        <div className="about-cards">
          <div className="about-card gradient1">
            <h3>Safe & Confidential</h3>
            <p>
              Students can report sensitive issues without fear, ensuring privacy
              and psychological safety.
            </p>
          </div>

          <div className="about-card gradient2">
            <h3>Transparent Workflow</h3>
            <p>
              Every complaint follows a clear resolution pipeline with real-time
              status updates.
            </p>
          </div>

          <div className="about-card gradient3">
            <h3>Institutional Accountability</h3>
            <p>
              Role-based access ensures faster action, ownership, and measurable
              outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Core Features</h2>

        <div className="feature-cards">
          <div className="card">
            <FiUser className="card-icon" />
            <h3>Anonymous Reporting</h3>
            <p>
              Report grievances securely without revealing identity when needed.
            </p>
          </div>

          <div className="card">
            <FiTrendingUp className="card-icon" />
            <h3>Live Status Tracking</h3>
            <p>
              Monitor issue progress from submission to final resolution.
            </p>
          </div>

          <div className="card">
            <FiShield className="card-icon" />
            <h3>Role-Based Resolution</h3>
            <p>
              Structured access for admins and faculty ensures faster action.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
