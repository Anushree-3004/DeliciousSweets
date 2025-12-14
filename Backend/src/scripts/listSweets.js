require("dotenv").config();
const connectDB = require("../config/db");
const Sweet = require("../models/Sweet");

/**
 * Script to list all sweets with their IDs
 */
async function listSweets() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully!\n");

    const sweets = await Sweet.find().sort({ createdAt: -1 });

    if (sweets.length === 0) {
      console.log("No sweets found in the database.");
      console.log("\nTo add sweets, run: npm run seed");
    } else {
      console.log(`Found ${sweets.length} sweet(s):\n`);
      console.log("=".repeat(80));
      sweets.forEach((sweet, index) => {
        console.log(`\n${index + 1}. ${sweet.name}`);
        console.log(`   Category: ${sweet.category}`);
        console.log(`   Price: ₹${sweet.price}`);
        console.log(`   Stock: ${sweet.quantity}`);
        console.log(`   ID: ${sweet._id}`);
        console.log(`   Created: ${sweet.createdAt}`);
      });
      console.log("\n" + "=".repeat(80));
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

listSweets();

