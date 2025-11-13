import mongoose from "mongoose";
import dotenv from "dotenv";
import Donor from "../models/Donor.js";

dotenv.config();

async function cleanupOldDonors() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Find all donors without the new fields
    const oldDonors = await Donor.find({
      $or: [
        { isFirstTimeDonor: { $exists: false } },
        { lastBloodDonatedDate: { $exists: false } },
      ],
    });

    console.log(`\n📋 Found ${oldDonors.length} old donor records without new fields:`);
    oldDonors.forEach((donor) => {
      console.log(`   - ${donor.name} (${donor.email})`);
    });

    if (oldDonors.length === 0) {
      console.log("✅ No old records found. Database is clean!");
      process.exit(0);
    }

    // Ask for confirmation (just show what will be deleted in this script)
    console.log("\n⚠️  These records will be deleted to clean up the database.");
    console.log("💡 Tip: You can also manually delete them from MongoDB Compass if preferred.\n");

    // Delete old donors
    const result = await Donor.deleteMany({
      $or: [
        { isFirstTimeDonor: { $exists: false } },
        { lastBloodDonatedDate: { $exists: false } },
      ],
    });

    console.log(`✅ Deleted ${result.deletedCount} old donor records`);

    // Show remaining donors
    const remainingDonors = await Donor.find();
    console.log(`\n📦 Remaining donors in database: ${remainingDonors.length}`);
    remainingDonors.forEach((donor) => {
      console.log(`   - ${donor.name}: firstTime=${donor.isFirstTimeDonor}, lastDate=${donor.lastBloodDonatedDate}`);
    });

    console.log("\n✅ Cleanup complete! Your database is now clean.");
    console.log("🚀 You can now restart your backend and register new test donors.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during cleanup:", err);
    process.exit(1);
  }
}

cleanupOldDonors();
