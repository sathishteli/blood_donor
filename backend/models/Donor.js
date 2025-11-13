import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  lastDonationDate: { type: Date, required: true },
  available: { type: Boolean, default: true },
});

// ✅ Automatically check donor eligibility (90 days since last donation)
donorSchema.pre("save", function (next) {
  const daysSince = Math.floor(
    (Date.now() - new Date(this.lastDonationDate)) / (1000 * 60 * 60 * 24)
  );
  this.available = daysSince >= 90;
  next();
});

export default mongoose.model("Donor", donorSchema);
