import express from "express";
import Donor from "../models/Donor.js";

const router = express.Router();

// 🔹 Register new donor
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone, lastDonationDate } = req.body;

    if (!name || !email || !password || !bloodGroup || !city || !phone || !lastDonationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const donor = new Donor({
      name,
      email,
      password,
      bloodGroup,
      city,
      phone,
      lastDonationDate,
    });

    await donor.save();
    res.status(201).json({ message: "Donor registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering donor:", error);
    res.status(500).json({ message: "Error registering donor" });
  }
});

// 🔹 Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const donor = await Donor.findOne({ email });

    if (!donor || donor.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful!", donor });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// 🔹 Fetch all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donors" });
  }
});

export default router;
