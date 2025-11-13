import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  isDonor: { type: Boolean, default: true }, // ✅ mark all registered users as donors
  isFirstTimeDonor: { type: Boolean, default: true }, // ✅ Track if first-time donor
  lastBloodDonatedDate: { type: Date, default: null }, // ✅ Store last blood donation date
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
