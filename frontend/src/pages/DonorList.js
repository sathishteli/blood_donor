import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DonorList.css";

function DonorList() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/donors")
      .then((res) => setDonors(res.data))
      .catch((err) => console.error("Error fetching donors:", err));
  }, []);

  const filtered = donors.filter(
    (d) =>
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="donor-list">
      <h2>Available Donors</h2>
      <input
        placeholder="Search by city or blood group..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filtered.map((d) => (
          <li key={d._id}>
            <span>{d.name}</span> — {d.bloodGroup} — {d.city} — {d.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorList;
