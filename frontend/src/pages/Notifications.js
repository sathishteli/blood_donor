import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState("");

  const fetchNotifications = async () => {
    if (!email) return;
    const res = await axios.get(`http://localhost:5000/api/notifications/${email}`);
    setNotifications(res.data);
  };

  return (
    <div className="notif-page">
      <h2>My Notifications</h2>
      <input
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={fetchNotifications}>View</button>

      <ul>
        {notifications.length === 0 && <p>No notifications yet.</p>}
        {notifications.map((n) => (
          <li key={n._id} className="notif-card">
            <p>{n.message}</p>
            <span>{new Date(n.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
