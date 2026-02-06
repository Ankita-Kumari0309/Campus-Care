// src/pages/Signup.jsx
import React, { useState } from "react";
import Navbar from "../components/NavBar";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Password validation (6 characters)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
     await axios.post(
     `${process.env.REACT_APP_API_URL}/api/auth/signup`,
      formData
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="signup-container">
        <div className="signup-card">
          <h2>Create your account</h2>
          <p className="subtitle">
            Join <strong>CampusCare+</strong> and get started
          </p>

          <form onSubmit={handleSignup}>
            {/* Name */}
            <div className="input-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Full Name</label>
            </div>

            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Email Address</label>
            </div>

            {/* Password */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Password</label>
            </div>

            {/* Role */}
            <div className="input-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
              <label>Role</label>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
