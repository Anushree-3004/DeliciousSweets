require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

/**
 * Script to make a user an admin by email
 * Usage: node src/scripts/makeAdmin.js <email>
 */
async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Error: Please provide an email address");
    console.log("Usage: node src/scripts/makeAdmin.js <email>");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully!\n");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found.`);
      console.log("\nAvailable users:");
      const allUsers = await User.find().select("name email role -_id");
      if (allUsers.length === 0) {
        console.log("  No users found. Please register first.");
      } else {
        allUsers.forEach((u) => {
          console.log(`  - ${u.email} (${u.name}) [${u.role}]`);
        });
      }
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`✅ User "${email}" is already an admin.`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ Successfully promoted "${email}" to admin!`);
    console.log(`   User: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();

