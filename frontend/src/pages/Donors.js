// src/pages/Donors.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Donors.css";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch donors from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donors")
      .then((res) => setDonors(res.data))
      .catch((err) => console.error("❌ Error fetching donors:", err));
  }, []);

  // ✅ Filter donors by city or blood group
  const filteredDonors = donors.filter(
    (donor) =>
      donor.city.toLowerCase().includes(search.toLowerCase()) ||
      donor.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Handle blood request and create notification
  const handleRequest = async (donor) => {
    try {
      const recipientName = prompt("Enter your Name:");
      const recipientCity = prompt("Enter the Hospital address:");

      if (!recipientName || !recipientCity) {
        alert("⚠️ Please enter both your name and city to send a request.");
        return;
      }

      // 📨 Send POST request to create notification
      await axios.post("http://localhost:5000/api/notifications", {
        donorEmail: donor.email,
        recipientName,
        recipientCity,
        bloodGroup: donor.bloodGroup,
      });

      alert(
        `✅ Blood Request Sent!\n\nDonor: ${donor.name}\nBlood Group: ${donor.bloodGroup}\nCity: ${donor.city}\nPhone: ${donor.phone}`
      );
    } catch (err) {
      console.error("❌ Error sending request:", err);
      alert("❌ Failed to send blood request. Please try again later.");
    }
  };

  return (
    <div className="donor-page">
      <div className="header">
        <h1>Find a Blood Donor</h1>
        <p>Search for available donors in your city and save lives 🩸</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by city or blood group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="donor-grid">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => (
            <div key={donor._id} className="donor-card">
              <div className="donor-header">
                <h3>{donor.name}</h3>
                <span
                  className={`status-dot ${
                    donor.available ? "available" : "unavailable"
                  }`}
                ></span>
              </div>

              <p className="blood">🩸 {donor.bloodGroup}</p>
              <p>📍 {donor.city}</p>
              <p>📞 {donor.phone}</p>
              <p className="donor-status">
                {donor.available ? "Available" : "Not Yet Eligible"}
              </p>

              <button
                className="request-btn"
                onClick={() => handleRequest(donor)}
                disabled={!donor.available}
              >
                Request Blood
              </button>
            </div>
          ))
        ) : (
          <p className="no-donors">No donors found</p>
        )}
      </div>
    </div>
  );
};

export default Donors;
