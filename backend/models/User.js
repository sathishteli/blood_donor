import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  isDonor: { type: Boolean, default: true }, // ✅ mark all registered users as donors
});

const User = mongoose.model("User", userSchema);
export default User;
