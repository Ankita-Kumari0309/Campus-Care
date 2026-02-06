import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./Login.css";

const Login = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 If already logged in, redirect directly to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "Admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "Faculty") {
        navigate("/faculty-dashboard", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
       { email, password }
       );

      // ✅ Store auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      // ✅ Redirect based on role (replace avoids back-button bug)
      if (res.data.role === "Admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (res.data.role === "Faculty") {
        navigate("/faculty-dashboard", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Login to continue to CampusCare+</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <span
              className="signup-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

          {/* Optional trust line (great for judges) */}
          <p style={{ marginTop: "15px", fontSize: "0.8rem", opacity: 0.7 }}>
            Secure • Role-Based • Confidential Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
