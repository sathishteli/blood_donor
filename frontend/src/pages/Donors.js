// src/pages/Donors.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Donors.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Fetch donors from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/donors`)
      .then((res) => {
        console.log("🔍 Donors fetched from backend:", res.data);
        res.data.forEach((donor) => {
          console.log(`📋 Donor: ${donor.name}`, {
            isFirstTimeDonor: donor.isFirstTimeDonor,
            lastBloodDonatedDate: donor.lastBloodDonatedDate,
            available: donor.available,
            email: donor.email,
          });
        });
        setDonors(res.data);
      })
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
      await axios.post(`${API_URL}/api/notifications`, {
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
          filteredDonors.map((donor) => {
            // Determine eligibility client-side if backend doesn't provide `available`
            const computeEligibility = () => {
              console.log(`\n🔍 Computing eligibility for: ${donor.name}`);
              console.log(`   isFirstTimeDonor: ${donor.isFirstTimeDonor}`);
              console.log(`   lastBloodDonatedDate: ${donor.lastBloodDonatedDate}`);
              console.log(`   available field: ${donor.available}`);
              
              if (typeof donor.available === "boolean") {
                console.log(`   ✓ Using backend available: ${donor.available}`);
                return donor.available;
              }
              
              // first-time donors are eligible
              if (donor.isFirstTimeDonor === true || donor.isFirstTimeDonor === "true") {
                console.log(`   ✓ First-time donor: eligible`);
                return true;
              }
              
              // If no previous donation date, they are automatically eligible
              if (!donor.lastBloodDonatedDate) {
                console.log(`   ✓ No donation date: assuming eligible`);
                return true;
              }

              try {
                // Parse the date - handle both ISO and DD-MM-YYYY formats
                let lastDate = new Date(donor.lastBloodDonatedDate);
                
                // If date is invalid, try parsing as DD-MM-YYYY
                if (isNaN(lastDate.getTime())) {
                  const parts = donor.lastBloodDonatedDate.split('-');
                  if (parts.length === 3) {
                    // Try YYYY-MM-DD format
                    lastDate = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
                  }
                }
                
                if (isNaN(lastDate.getTime())) {
                  console.log(`   ✓ Invalid date format: assuming eligible`);
                  return true; // If date can't be parsed, assume eligible
                }

                const now = new Date();
                const timeDiff = now - lastDate;
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                
                // Debug log
                console.log(`   Parsed Date: ${lastDate.toLocaleDateString()}, Days: ${days}, Eligible: ${days >= 90}`);
                
                return days >= 90;
              } catch (error) {
                console.error(`   Error parsing date for ${donor.name}:`, error);
                return true; // If error, assume eligible
              }
            };

            const eligible = computeEligibility();

            // Calculate days since last donation for display
            let daysSinceLastDonation = null;
            if (donor.lastBloodDonatedDate) {
              const lastDate = new Date(donor.lastBloodDonatedDate);
              if (!isNaN(lastDate.getTime())) {
                const now = new Date();
                daysSinceLastDonation = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
              }
            }

            return (
              <div key={donor._id} className="donor-card">
                <div className="donor-header">
                  <h3>{donor.name}</h3>
                  <span className={`status-dot ${eligible ? "available" : "unavailable"}`}></span>
                </div>

                <p className="blood">🩸 {donor.bloodGroup}</p>
                <p>📍 {donor.city}</p>
                <p>📞 {donor.phone}</p>
                <p className="donor-lastdonation">
                  {donor.isFirstTimeDonor === true || donor.isFirstTimeDonor === "true"
                    ? "📅 First Time Donor ✨"
                    : donor.lastBloodDonatedDate
                    ? `📅 Last Donated: ${new Date(donor.lastBloodDonatedDate).toLocaleDateString()} (${daysSinceLastDonation} days ago)`
                    : "📅 No donation date"}
                </p>
                <p className="donor-status">{eligible ? "✅ Available" : "❌ Not Yet Eligible"}</p>

                <button className="request-btn" onClick={() => handleRequest(donor)} disabled={!eligible}>
                  Request Blood
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-donors">No donors found</p>
        )}
      </div>
    </div>
  );
};

export default Donors;
