import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  donorEmail: { type: String, required: true },
  donorName: { type: String },
  city: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
