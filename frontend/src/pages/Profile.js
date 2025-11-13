// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    setUser(loggedUser);

    axios
      .get(`http://localhost:5000/api/notifications/${loggedUser.email}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{user.name}</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="profile-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.city || "Not provided"}</p>
          <p><strong>Blood Group:</strong> {user.bloodGroup || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
        </div>

        <div className="notifications">
          <h3>🔔 Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((note, index) => (
              <div key={index} className="notification-card">
                <p>{note.message}</p>
                <span className="note-date">
                  {new Date(note.date).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="no-notifications">No new notifications 💬</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
