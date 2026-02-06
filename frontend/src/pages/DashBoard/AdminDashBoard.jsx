import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, FaClipboardList, FaChartBar, FaSignOutAlt, FaBars, FaHome, FaEnvelope, FaLock, FaUserCircle
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./AdminDashBoard.css";
import logo from '../../assets/logoicon.png';


ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("welcome");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [issues, setIssues] = useState([]);

  // Fetch all issues from backend
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/issues/all`, { headers });
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err.response?.data || err.message);
    }
  };

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.name);
      setUserEmail(res.data.email);
      setUserRole(res.data.role || "Admin");
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
      alert("Failed to fetch profile!");
    }
  };

  // Save profile updates
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        { name: userName, email: userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile!");
    }
  };

  // Update issue status
  const updateIssueStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/issues/${id}/status`,
        { status: newStatus },
        { headers }
      );
      setIssues(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") navigate("/login");
    else {
      fetchProfile();
      fetchIssues();
    }
    // eslint-disable-next-line
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { key: "welcome", icon: <FaHome />, label: "Welcome" },
    { key: "profile", icon: <FaUser />, label: "Profile" },
    { key: "allIssues", icon: <FaClipboardList />, label: "All Issues" },
    { key: "myIssues", icon: <FaClipboardList />, label: "My Issues" },
    { key: "stats", icon: <FaChartBar />, label: "Insights" },
  ];

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
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        hoverBackgroundColor: ["#66bb6a", "#ffb74d", "#42a5f5"],
      },
    ],
  };

  // My Issues → only sensitive or anomalous
  const myIssues = issues.filter(i => i.sensitive || i.anomalous);

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
              <input type="text" value={userRole} readOnly />
            </div>
            <button
              className="btn-submit"
              onClick={editMode ? saveProfile : () => setEditMode(true)}
            >
              {editMode ? "Save" : "Edit"}
            </button>
          </div>
        );

      case "allIssues":
        return (
          <div className="page-content card">
            <h2>All Issues</h2>
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Sensitive</th>
                  <th>Anonymous</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue._id}>
                    <td>{issue._id.slice(-6)}</td>
                    <td>{issue.student?.name || "System"}</td>
                    <td>{issue.title}</td>
                    <td className={`status-${issue.status.replace(" ", "").toLowerCase()}`}>{issue.status}</td>
                    <td>{issue.sensitive ? "Yes" : "No"}</td>
                    <td>{issue.anonymous ? "Yes" : "No"}</td>
                    <td>
                      <select value={issue.status} onChange={e => updateIssueStatus(issue._id, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "myIssues":
        return (
          <div className="page-content card">
            <h2>My Issues</h2>
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.length > 0 ? myIssues.map(issue => (
                  <tr key={issue._id}>
                    <td>{issue._id.slice(-6)}</td>
                    <td>{issue.title}</td>
                    <td className={`status-${issue.status.replace(" ", "").toLowerCase()}`}>{issue.status}</td>
                    <td>
                      <select value={issue.status} onChange={e => updateIssueStatus(issue._id, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No sensitive or anomalous issues yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "stats":
        return (
          <div className="page-content card stats-page">
            <h2>Statistics</h2>
            <div className="stats-cards">
              {[ 
                { label: "Total Issues", value: issues.length },
                { label: "Resolved", value: issues.filter(i => i.status === "Resolved").length },
                { label: "Pending", value: issues.filter(i => i.status === "Pending").length },
                { label: "In Progress", value: issues.filter(i => i.status === "In Progress").length }
              ].map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
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
            <p>CampusCare Admin Dashboard</p>
            <ul>
              <li>View and update your profile</li>
              <li>See all system-submitted issues</li>
              <li>Track sensitive or anomalous issues (My Issues)</li>
              <li>View statistics and charts</li>
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
          {sidebarOpen && (
  <div className="logo-container">
    <img src={logo} alt="Logo" className="logo-icon" />
    <span className="logo-text">CampusCare+</span>
  </div>
)}

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

export default AdminDashboard;
