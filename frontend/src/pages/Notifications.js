import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.email) {
          console.error("User not found in localStorage");
          setLoading(false);
          return;
        }
        
        const res = await axios.get(`${API_URL}/api/notifications/${user.email}`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notif-page">
      <h2>My Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <ul>
          {notifications.length === 0 && <p>No notifications yet.</p>}
          {notifications.map((n) => (
            <li key={n._id} className="notif-card">
              <p>{n.message}</p>
              <span>{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
