require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

/**
 * Script to list all users in the database
 */
async function listUsers() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully!\n");

    const users = await User.find().select("name email role -_id").sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log("No users found in the database.");
      console.log("\nTo create a user:");
      console.log("1. Go to http://localhost:5173/register");
      console.log("2. Register with any email and password");
      console.log("3. Then run: npm run make-admin <your-email>");
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        const roleBadge = user.role === "admin" ? "👑 ADMIN" : "👤 USER";
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${roleBadge}`);
        console.log("");
      });
      console.log("\nTo promote a user to admin, run:");
      console.log("  npm run make-admin <email>");
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

listUsers();

