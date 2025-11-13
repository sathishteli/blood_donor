import express from "express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
const router = express.Router();

// ✅ Register a new donor
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      bloodGroup,
      city,
      phone,
      isDonor: true,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ Get all donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await User.find({ isDonor: true }).select("-password");
    res.json(donors);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch donors" });
  }
});

export default router;
