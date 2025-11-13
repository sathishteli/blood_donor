// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Donor from "../models/Donor.js";

const router = express.Router();

/**
 * ✅ REGISTER USER & DONOR TOGETHER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone } = req.body;

    // Validation
    if (!name || !email || !password || !bloodGroup || !city || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already exists
    const existingUser = await User.findOne({ email });
    const existingDonor = await Donor.findOne({ email });

    if (existingUser || existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      city,
      phone,
    });
    await newUser.save();

    // ✅ Create corresponding donor record
    const newDonor = new Donor({
      name,
      email,
      bloodGroup,
      city,
      phone,
      lastDonationDate: new Date(), // default: now
      available: true,
    });
    await newDonor.save();

    console.log(`✅ New user & donor registered: ${email}`);

    res.status(201).json({ message: "🎉 Registration successful!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/**
 * ✅ LOGIN USER (supports hashed passwords)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error(`❌ Incorrect password for: ${email}`);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log(`✅ Login successful for: ${email}`);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
