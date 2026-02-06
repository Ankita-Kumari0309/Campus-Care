import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaClipboardList, FaChartBar, FaSignOutAlt, FaBars, FaHome, FaEnvelope, FaLock, FaUserCircle
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./StudentDashBoard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashBoard = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("welcome");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [sensitive, setSensitive] = useState(false);
  const [issues, setIssues] = useState([]);

  // Pie chart data
  const pieData = {
    labels: ["Resolved", "Pending", "In Progress"],
    datasets: [
      {
        data: [
          issues.filter(i => i.status === "Resolved").length,
          issues.filter(i => i.status === "Pending").length,
          issues.filter(i => i.status === "In Progress").length
        ],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
        hoverBackgroundColor: ["#66bb6a", "#e57373", "#42a5f5"],
      },
    ],
  };

  // On load, check login and fetch profile & issues
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Student") navigate("/login");
    else {
      fetchProfile(token); // Fetch backend profile
      fetchIssues(token);
    }
  }, [navigate]);

  // ------------------- PROFILE -------------------
  const fetchProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.name);
      setUserEmail(res.data.email);
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Failed to fetch profile from server!");
    }
  };

  const updateProfile = async () => {
    if (!userName || !userEmail) return alert("Name and Email cannot be empty!");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        { name: userName, email: userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserName(res.data.name);
      setUserEmail(res.data.email);

      // Update localStorage so it persists across refresh
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile!");
    }
  };
  // ---------------- END PROFILE -------------------

  // ------------------- ISSUES -------------------
  const fetchIssues = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/issues/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const createIssue = async () => {
    if (!title || !description) return alert("Title and Description are required!");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/issues/create",
        { title, description, anonymous, sensitive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Issue created successfully!");
      setIssues(prev => [...prev, res.data]);
      setTitle(""); setDescription(""); setAnonymous(false); setSensitive(false);
    } catch (err) {
      console.error(err);
      alert("Error creating issue!");
    }
  };
  // ---------------- END ISSUES -------------------

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { key: "welcome", icon: <FaHome />, label: "Welcome" },
    { key: "profile", icon: <FaUser />, label: "Profile" },
    { key: "create", icon: <FaClipboardList />, label: "Create Issue" },
    { key: "stats", icon: <FaChartBar />, label: "Stats" },
  ];

  const getStatusClass = (status) => {
    switch(status){
      case "Resolved": return "status-resolved";
      case "Pending": return "status-pending";
      case "In Progress": return "status-progress";
      default: return "";
    }
  };

  const renderContent = () => {
    switch(activePage) {
      case "profile":
        return (
          <div className="page-content card form-horizontal">
            <h2>Profile</h2>
            <div className="form-group">
              <label><FaUserCircle /> Name</label>
              <input
                type="text"
                value={userName}
                readOnly={!editMode}
                onChange={e => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                value={userEmail}
                readOnly={!editMode}
                onChange={e => setUserEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label><FaLock /> Role</label>
              <input type="text" value="Student" readOnly />
            </div>
            <button
              className="btn-submit"
              onClick={() => editMode ? updateProfile() : setEditMode(true)}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        );

      case "create":
        return (
          <div className="page-content card form-horizontal">
            <h2>Create Issue</h2>
            <div className="form-group">
              <label>Title</label>
              <input type="text" placeholder="Enter issue title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Enter issue details..." rows={5} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-group checkboxes-left">
              <label><input type="checkbox" checked={anonymous} onChange={() => setAnonymous(!anonymous)} /> Anonymous</label>
              <label><input type="checkbox" checked={sensitive} onChange={() => setSensitive(!sensitive)} /> Sensitive</label>
            </div>
            <button className="btn-submit" onClick={createIssue}>Submit</button>

            {issues.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h3>Your Submitted Issues</h3>
                <table className="issues-table beautiful-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue, idx) => (
                      <tr key={idx}>
                        <td>{issue._id}</td>
                        <td>{issue.title}</td>
                        <td>{issue.description}</td>
                        <td className={getStatusClass(issue.status)}>{issue.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case "stats":
        return (
          <div className="page-content card">
            <h2>Statistics & All Issues</h2>
            <div className="cards-container">
              <div className="stat-card">Total Issues: {issues.length}</div>
              <div className="stat-card">Resolved: {issues.filter(i => i.status === "Resolved").length}</div>
              <div className="stat-card">Pending: {issues.filter(i => i.status === "Pending").length}</div>
              <div className="stat-card">In Progress: {issues.filter(i => i.status === "In Progress").length}</div>
            </div>
            <div style={{ marginTop: "30px" }}>
              <h3>All Issues</h3>
              <table className="issues-table beautiful-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, idx) => (
                    <tr key={idx}>
                      <td>{issue._id}</td>
                      <td>{issue.title}</td>
                      <td>{issue.description}</td>
                      <td className={getStatusClass(issue.status)}>{issue.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="chart-container">
              <Pie data={pieData} />
            </div>
          </div>
        );

      default:
        return (
          <div className="page-content welcome-card card">
            <h2>Welcome, {userName}!</h2>
            <p>CampusCare is a platform to help students manage campus issues effectively.</p>
            <ul>
              <li>View and update your profile</li>
              <li>Create new issue requests</li>
              <li>Track stats and progress of issues</li>
              <li>Logout securely</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h2 className="logo">CampusCare</h2>}
          <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}><FaBars size={24} /></div>
        </div>
        <ul>
          {menuItems.map(item => (
            <li key={item.key} onClick={() => setActivePage(item.key)} className={activePage === item.key ? "active" : ""}>
              <span className="icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
            </li>
          ))}
          <li onClick={handleLogout} className="logout"><FaSignOutAlt className="icon" /><span className="link-text">Logout</span></li>
        </ul>
        <div className="toggle-container">
          {sidebarOpen && (
            <>
              <label className="switch">
                <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">Dark Mode</span>
            </>
          )}
        </div>
      </div>
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default StudentDashBoard;
