import Donor from "../models/Donor.js";

// @desc Register a new donor
export const registerDonor = async (req, res) => {
  try {
    const { name, bloodGroup, city, contactNumber } = req.body;

    if (!name || !bloodGroup || !city || !contactNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const donor = new Donor({ name, bloodGroup, city, contactNumber });
    await donor.save();

    res.status(201).json({ message: "Donor registered successfully", donor });
  } catch (error) {
    console.error("❌ Error registering donor:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Get all donors
export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donors", error });
  }
};
