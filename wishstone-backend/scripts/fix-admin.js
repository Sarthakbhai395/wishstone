/**
 * fix-admin.js
 * Run this to recreate the admin user WITHOUT deleting any other data.
 * Usage: node scripts/fix-admin.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

async function fixAdmin() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected");

  // Remove existing admin (if any) and recreate fresh
  await User.deleteOne({ email: "admin@wishstone.com" });
  console.log("🗑  Old admin removed (if existed)");

  await User.create({
    name: "Wishstone Admin",
    email: "admin@wishstone.com",
    password: "wishstone@123",
    role: "admin",
  });

  console.log("👑 Admin recreated successfully!");
  console.log("   Email   : admin@wishstone.com");
  console.log("   Password: wishstone@123");
  console.log("\n✅ Now login to your admin panel.\n");
  process.exit(0);
}

fixAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
