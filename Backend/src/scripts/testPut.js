require("dotenv").config();
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
const SWEET_ID = "693eef6146a3a0e4b564b768"; // Kulfi

async function testPut() {
  try {
    console.log("Testing PUT /api/sweets/:id\n");
    console.log("=".repeat(60));

    // Step 1: Login as admin to get token
    console.log("\n1. Logging in as admin...");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: "anushree.patel@icloud.com",
      password: "your-password-here", // User needs to provide actual password
    });

    const token = loginRes.data.token;
    console.log("✅ Login successful!");
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   Role: ${loginRes.data.role}\n`);

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Get current sweet details
    console.log("2. Getting current sweet details...");
    const getRes = await axios.get(`${BASE_URL}/sweets/${SWEET_ID}`, { headers });
    const currentSweet = getRes.data;
    console.log("✅ Current sweet details:");
    console.log(`   Name: ${currentSweet.name}`);
    console.log(`   Category: ${currentSweet.category}`);
    console.log(`   Price: ₹${currentSweet.price}`);
    console.log(`   Quantity: ${currentSweet.quantity}\n`);

    // Step 3: Update the sweet
    console.log("3. Updating sweet...");
    const updateData = {
      name: currentSweet.name, // Keep same name
      category: currentSweet.category, // Keep same category
      price: currentSweet.price + 5, // Increase price by ₹5
      quantity: currentSweet.quantity + 10, // Increase quantity by 10
    };

    console.log("   Update data:");
    console.log(`   - Price: ₹${currentSweet.price} → ₹${updateData.price}`);
    console.log(`   - Quantity: ${currentSweet.quantity} → ${updateData.quantity}\n`);

    const updateRes = await axios.put(`${BASE_URL}/sweets/${SWEET_ID}`, updateData, { headers });
    console.log("✅ Update successful!");
    console.log("\n   Updated sweet:");
    console.log(`   Name: ${updateRes.data.name}`);
    console.log(`   Category: ${updateRes.data.category}`);
    console.log(`   Price: ₹${updateRes.data.price}`);
    console.log(`   Quantity: ${updateRes.data.quantity}`);
    console.log(`   ID: ${updateRes.data._id}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ PUT request test completed successfully!");
  } catch (error) {
    console.error("\n❌ Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error("\n⚠️  Authentication failed. Please check your email and password.");
      console.log("   Update the email and password in this script, or login manually to get a token.");
    } else if (error.response?.status === 403) {
      console.error("\n⚠️  Admin access required. Make sure you're logged in as admin.");
    } else if (error.response?.status === 404) {
      console.error(`\n⚠️  Sweet with ID ${SWEET_ID} not found.`);
    }
    process.exit(1);
  }
}

testPut();

