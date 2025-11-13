// backend/routes/notificationRoutes.js
import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

/**
 * ✅ Create a new notification for a donor
 */
router.post("/", async (req, res) => {
  try {
    const { donorEmail, recipientName, recipientCity, bloodGroup } = req.body;

    if (!donorEmail || !recipientName || !recipientCity || !bloodGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const message = `🩸 Urgent Request: ${recipientName} in ${recipientCity} needs ${bloodGroup} blood.`;

    const notification = new Notification({
      donorEmail,
      donorName: donorEmail.split("@")[0],
      city: recipientCity,
      bloodGroup,
      message,
      date: new Date(),
    });

    await notification.save();
    res.status(201).json({ message: "Notification sent successfully!" });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ message: "Server error while creating notification" });
  }
});

/**
 * ✅ Fetch notifications for a specific donor
 */
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ donorEmail: email }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

export default router;
