import React, { useState } from "react";
import "./NavBar.css";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import logoIcon from "../assets/logoicon.png";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <img src={logoIcon} alt="CampusCare+ Logo" className="navbar-logo" />
        <div className="site-name">
          CampusCare<span className="plus">+</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="/login" className="login-btn">Login</a></li>
          <li><a href="/signup" className="signup-btn">Sign Up</a></li>
          <li>
            <button
              className="mode-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
          </li>
        </ul>

        {/* Hamburger */}
        <div
          className="hamburger"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FiMenu size={25} />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <img src={logoIcon} alt="CampusCare+ Logo" />
              <span>CampusCare+</span>
            </div>
            <FiX
              size={30}
              className="close-menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          <ul className="mobile-menu-links">
            <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
            <li><a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a></li>
            <li><a href="/login" onClick={() => setIsMobileMenuOpen(false)} className="login-btn">Login</a></li>
            <li><a href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="signup-btn">Sign Up</a></li>
            <li>
              <button
                className="mode-toggle"
                onClick={() => {
                  setIsDarkMode(!isDarkMode);
                  setIsMobileMenuOpen(false);
                }}
              >
                {isDarkMode ? <FiSun /> : <FiMoon />}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
