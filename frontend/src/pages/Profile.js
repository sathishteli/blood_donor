// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [canDonate, setCanDonate] = useState(false);
  const navigate = useNavigate();

  const checkDonationEligibility = (userData) => {
    // If first-time donor, they can donate
    if (userData.isFirstTimeDonor === true || userData.isFirstTimeDonor === "true") {
      return true;
    }

    // If they have donated before, check if it's been more than 90 days
    if (userData.lastBloodDonatedDate) {
      const lastDonatedDate = new Date(userData.lastBloodDonatedDate);
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate - lastDonatedDate) / (1000 * 60 * 60 * 24));
      return daysPassed >= 90;
    }

    return false;
  };

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      navigate("/login");
      return;
    }
    setUser(loggedUser);
    setCanDonate(checkDonationEligibility(loggedUser));

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
          <p>
            <strong>First Time Donor:</strong>{" "}
            {user.isFirstTimeDonor === true || user.isFirstTimeDonor === "true"
              ? "Yes ✅"
              : "No"}
          </p>
          {(user.isFirstTimeDonor === false || user.isFirstTimeDonor === "false") && user.lastBloodDonatedDate && (
            <p>
              <strong>Last Blood Donated:</strong>{" "}
              {new Date(user.lastBloodDonatedDate).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Eligible for Blood Request:</strong>{" "}
            <span className={canDonate ? "eligible" : "not-eligible"}>
              {canDonate ? "✅ Yes" : "❌ Not yet (need to wait 90 days after last donation)"}
            </span>
          </p>
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
