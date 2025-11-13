import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bloodGroup: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  isFirstTimeDonor: { type: Boolean, default: true },
  lastBloodDonatedDate: { type: Date, default: null },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Automatically check donor eligibility (90 days since last donation)
donorSchema.pre("save", function (next) {
  // First-time donors are always available
  if (this.isFirstTimeDonor === true) {
    this.available = true;
    return next();
  }

  // If no last donation date, assume available
  if (!this.lastBloodDonatedDate) {
    this.available = true;
    return next();
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(this.lastBloodDonatedDate)) / (1000 * 60 * 60 * 24)
  );
  this.available = daysSince >= 90;
  next();
});

export default mongoose.model("Donor", donorSchema);
