import express from "express";
import Donor from "../models/Donor.js";

const router = express.Router();

// 🔹 Register new donor
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone, isFirstTimeDonor, lastBloodDonatedDate } = req.body;

    console.log("📝 Donor Registration Request Received:");
    console.log(`  name: ${name}`);
    console.log(`  email: ${email}`);
    console.log(`  bloodGroup: ${bloodGroup}`);
    console.log(`  city: ${city}`);
    console.log(`  phone: ${phone}`);
    console.log(`  isFirstTimeDonor: ${isFirstTimeDonor} (type: ${typeof isFirstTimeDonor})`);
    console.log(`  lastBloodDonatedDate: ${lastBloodDonatedDate}`);

    if (!name || !email || !password || !bloodGroup || !city || !phone) {
      return res.status(400).json({ message: "All required fields are needed" });
    }

    const existingDonor = await Donor.findOne({ email });
    if (existingDonor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const donorData = {
      name,
      email,
      password,
      bloodGroup,
      city,
      phone,
      isFirstTimeDonor: isFirstTimeDonor === true || isFirstTimeDonor === "true" ? true : false,
    };

    // Only set lastBloodDonatedDate if provided and not a first-time donor
    if (lastBloodDonatedDate && (isFirstTimeDonor === false || isFirstTimeDonor === "false")) {
      donorData.lastBloodDonatedDate = new Date(lastBloodDonatedDate);
      console.log(`  ✅ Setting lastBloodDonatedDate to: ${donorData.lastBloodDonatedDate}`);
    } else {
      console.log(`  ⚠️ Not setting lastBloodDonatedDate (firstTime=${donorData.isFirstTimeDonor}, date=${lastBloodDonatedDate})`);
    }

    const donor = new Donor(donorData);
    await donor.save();

    console.log(`✅ Donor saved successfully:`);
    console.log(`  isFirstTimeDonor: ${donor.isFirstTimeDonor}`);
    console.log(`  lastBloodDonatedDate: ${donor.lastBloodDonatedDate}`);
    console.log(`  available: ${donor.available}`);

    res.status(201).json({ message: "Donor registered successfully!", donor });
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

    // Return donor data with all fields
    const donorData = {
      _id: donor._id,
      name: donor.name,
      email: donor.email,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      phone: donor.phone,
      isFirstTimeDonor: donor.isFirstTimeDonor,
      lastBloodDonatedDate: donor.lastBloodDonatedDate,
      available: donor.available,
    };

    res.json({ message: "Login successful!", donor: donorData });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// 🔹 Fetch all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find().lean();
    
    // Log all donors to verify data
    console.log("📦 Fetching all donors from MongoDB:");
    donors.forEach((donor) => {
      console.log(`  Donor: ${donor.name}`, {
        isFirstTimeDonor: donor.isFirstTimeDonor,
        lastBloodDonatedDate: donor.lastBloodDonatedDate,
        available: donor.available,
        email: donor.email,
      });
    });
    
    res.json(donors);
  } catch (err) {
    console.error("❌ Error fetching donors:", err);
    res.status(500).json({ message: "Error fetching donors" });
  }
});

export default router;
