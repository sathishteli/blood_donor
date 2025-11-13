import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, bloodGroup, city, phone, isFirstTimeDonor, lastBloodDonatedDate } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    
    // Prepare user data
    const userData = {
      name,
      email,
      password: hashed,
      bloodGroup,
      city,
      phone,
      isFirstTimeDonor: isFirstTimeDonor === true || isFirstTimeDonor === "true" ? true : false,
    };

    // Only set lastBloodDonatedDate if it's provided and isFirstTimeDonor is false
    if (lastBloodDonatedDate && (isFirstTimeDonor === false || isFirstTimeDonor === "false")) {
      userData.lastBloodDonatedDate = new Date(lastBloodDonatedDate);
    }

    const user = new User(userData);
    await user.save();

    res.json({ message: "Registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Return all user data including donation info
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      city: user.city,
      phone: user.phone,
      isDonor: user.isDonor,
      isFirstTimeDonor: user.isFirstTimeDonor,
      lastBloodDonatedDate: user.lastBloodDonatedDate,
    };
    
    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
