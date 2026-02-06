// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashBoard from "./pages/DashBoard/StudentDashBoard";
import FacultyDashBoard from "./pages/DashBoard/FacultyDashBoard";
import AdminDashBoard from "./pages/DashBoard/AdminDashBoard";
import UpcomingFeatures from "./pages/UpcomingFeatures"; // ✅ New page

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Home isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        />
        <Route
          path="/login"
          element={<Login isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        />
        <Route
          path="/signup"
          element={<Signup isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        />

        {/* Dashboard Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashBoard
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute>
              <FacultyDashBoard
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashBoard
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </ProtectedRoute>
          }
        />

        {/* Upcoming Features */}
        <Route
          path="/upcoming-features"
          element={<UpcomingFeatures isDarkMode={isDarkMode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
