import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    city: "",
    phone: "",
    isFirstTimeDonor: true,
    lastBloodDonatedDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData); // ✅ use auth route
      alert("🎉 Registration successful! You can now log in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        bloodGroup: "",
        city: "",
        phone: "",
        isFirstTimeDonor: true,
        lastBloodDonatedDate: "",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert(
        error.response?.data?.message || "Error registering donor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>🩸 Become a LifeLink Donor</h2>
        <p className="register-subtitle">
          Register and join our lifesaving community.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A−">A−</option>
            <option value="B+">B+</option>
            <option value="B−">B−</option>
            <option value="O+">O+</option>
            <option value="O−">O−</option>
            <option value="AB+">AB+</option>
            <option value="AB−">AB−</option>
          </select>
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="donor-type-section">
            <label>Are you a first-time donor?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="isFirstTimeDonor"
                  value="true"
                  checked={formData.isFirstTimeDonor === true || formData.isFirstTimeDonor === "true"}
                  onChange={(e) =>
                    setFormData({ ...formData, isFirstTimeDonor: true })
                  }
                />
                Yes, First Time Donor
              </label>
              <label>
                <input
                  type="radio"
                  name="isFirstTimeDonor"
                  value="false"
                  checked={formData.isFirstTimeDonor === false || formData.isFirstTimeDonor === "false"}
                  onChange={(e) =>
                    setFormData({ ...formData, isFirstTimeDonor: false })
                  }
                />
                No, I have donated before
              </label>
            </div>
          </div>

          {!formData.isFirstTimeDonor && (
            <input
              name="lastBloodDonatedDate"
              type="date"
              placeholder="Last Blood Donated Date"
              value={formData.lastBloodDonatedDate}
              onChange={handleChange}
              required={!formData.isFirstTimeDonor}
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
