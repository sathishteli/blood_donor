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
    const { name, email, password, bloodGroup, city, phone, isFirstTimeDonor, lastBloodDonatedDate } = req.body;

    console.log("📝 Auth Registration Request Received:");
    console.log(`  name: ${name}`);
    console.log(`  email: ${email}`);
    console.log(`  isFirstTimeDonor: ${isFirstTimeDonor} (type: ${typeof isFirstTimeDonor})`);
    console.log(`  lastBloodDonatedDate: ${lastBloodDonatedDate}`);

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

    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      city,
      phone,
      isFirstTimeDonor: isFirstTimeDonor === true || isFirstTimeDonor === "true" ? true : false,
    };

    // Only set lastBloodDonatedDate if provided and not a first-time donor
    if (lastBloodDonatedDate && (isFirstTimeDonor === false || isFirstTimeDonor === "false")) {
      userData.lastBloodDonatedDate = new Date(lastBloodDonatedDate);
      console.log(`  ✅ User: Setting lastBloodDonatedDate to: ${userData.lastBloodDonatedDate}`);
    }

    // ✅ Create new user
    const newUser = new User(userData);
    await newUser.save();

    // Prepare donor data (same fields)
    const donorData = {
      name,
      email,
      password: hashedPassword,
      bloodGroup,
      city,
      phone,
      isFirstTimeDonor: userData.isFirstTimeDonor,
    };

    if (userData.lastBloodDonatedDate) {
      donorData.lastBloodDonatedDate = userData.lastBloodDonatedDate;
      console.log(`  ✅ Donor: Setting lastBloodDonatedDate to: ${donorData.lastBloodDonatedDate}`);
    }

    // ✅ Create corresponding donor record
    const newDonor = new Donor(donorData);
    await newDonor.save();

    console.log(`✅ New user & donor registered: ${email}`);
    console.log(`  User: isFirstTimeDonor=${newUser.isFirstTimeDonor}, lastDate=${newUser.lastBloodDonatedDate}`);
    console.log(`  Donor: isFirstTimeDonor=${newDonor.isFirstTimeDonor}, lastDate=${newDonor.lastBloodDonatedDate}, available=${newDonor.available}`);

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
    
    // Return all user data including donation info
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      city: user.city,
      phone: user.phone,
      isFirstTimeDonor: user.isFirstTimeDonor,
      lastBloodDonatedDate: user.lastBloodDonatedDate,
    };

    console.log(`📋 Returning user data:`, userData);

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
