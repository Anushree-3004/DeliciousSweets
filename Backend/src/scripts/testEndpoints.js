require("dotenv").config();
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testEndpoints() {
  console.log("Testing API Endpoints...\n");
  console.log("=".repeat(60));

  let token = "";
  let userId = "";
  let sweetId = "";

  try {
    // Test 1: Register
    console.log("\n1. Testing POST /api/auth/register");
    try {
      const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "test123",
      });
      console.log("   ✅ Register: SUCCESS");
      console.log(`   Response: ${JSON.stringify(registerRes.data)}`);
    } catch (err) {
      console.log("   ❌ Register: FAILED");
      console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
    }

    // Test 2: Login
    console.log("\n2. Testing POST /api/auth/login");
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: "anushree.patel@icloud.com",
        password: "your-password-here", // User needs to provide actual password
      });
      token = loginRes.data.token;
      console.log("   ✅ Login: SUCCESS");
      console.log(`   Token received: ${token.substring(0, 20)}...`);
      console.log(`   Role: ${loginRes.data.role}`);
    } catch (err) {
      console.log("   ❌ Login: FAILED");
      console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
      console.log("   ⚠️  Note: Using test credentials. Please login manually to get token.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Test 3: Get all sweets
    console.log("\n3. Testing GET /api/sweets");
    try {
      const sweetsRes = await axios.get(`${BASE_URL}/sweets`, { headers });
      console.log("   ✅ Get Sweets: SUCCESS");
      console.log(`   Found ${sweetsRes.data.length} sweets`);
      if (sweetsRes.data.length > 0) {
        sweetId = sweetsRes.data[0]._id;
        console.log(`   First sweet: ${sweetsRes.data[0].name} (ID: ${sweetId})`);
      }
    } catch (err) {
      console.log("   ❌ Get Sweets: FAILED");
      console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
    }

    // Test 4: Search sweets
    console.log("\n4. Testing GET /api/sweets/search");
    try {
      const searchRes = await axios.get(`${BASE_URL}/sweets/search`, {
        headers,
        params: { category: "Indian" },
      });
      console.log("   ✅ Search Sweets: SUCCESS");
      console.log(`   Found ${searchRes.data.length} Indian sweets`);
    } catch (err) {
      console.log("   ❌ Search Sweets: FAILED");
      console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
    }

    // Test 5: Add sweet (requires auth)
    console.log("\n5. Testing POST /api/sweets");
    try {
      const addRes = await axios.post(
        `${BASE_URL}/sweets`,
        {
          name: `Test Sweet ${Date.now()}`,
          category: "Test",
          price: 50,
          quantity: 10,
        },
        { headers }
      );
      console.log("   ✅ Add Sweet: SUCCESS");
      console.log(`   Created: ${addRes.data.name} (ID: ${addRes.data._id})`);
      sweetId = addRes.data._id;
    } catch (err) {
      console.log("   ❌ Add Sweet: FAILED");
      console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
    }

    if (sweetId) {
      // Test 6: Update sweet
      console.log("\n6. Testing PUT /api/sweets/:id");
      try {
        const updateRes = await axios.put(
          `${BASE_URL}/sweets/${sweetId}`,
          { price: 55 },
          { headers }
        );
        console.log("   ✅ Update Sweet: SUCCESS");
        console.log(`   Updated price to: ₹${updateRes.data.price}`);
      } catch (err) {
        console.log("   ❌ Update Sweet: FAILED");
        console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
      }

      // Test 7: Purchase sweet
      console.log("\n7. Testing POST /api/sweets/:id/purchase");
      try {
        const purchaseRes = await axios.post(
          `${BASE_URL}/sweets/${sweetId}/purchase`,
          { quantity: 1 },
          { headers }
        );
        console.log("   ✅ Purchase Sweet: SUCCESS");
        console.log(`   New quantity: ${purchaseRes.data.quantity}`);
      } catch (err) {
        console.log("   ❌ Purchase Sweet: FAILED");
        console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
      }

      // Test 8: Restock sweet (admin only)
      console.log("\n8. Testing POST /api/sweets/:id/restock");
      try {
        const restockRes = await axios.post(
          `${BASE_URL}/sweets/${sweetId}/restock`,
          { quantity: 1 },
          { headers }
        );
        console.log("   ✅ Restock Sweet: SUCCESS");
        console.log(`   New quantity: ${restockRes.data.quantity}`);
      } catch (err) {
        console.log("   ❌ Restock Sweet: FAILED");
        console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
        if (err.response?.status === 403) {
          console.log("   ⚠️  Admin access required");
        }
      }

      // Test 9: Delete sweet (admin only)
      console.log("\n9. Testing DELETE /api/sweets/:id");
      try {
        const deleteRes = await axios.delete(`${BASE_URL}/sweets/${sweetId}`, { headers });
        console.log("   ✅ Delete Sweet: SUCCESS");
        console.log(`   Message: ${deleteRes.data.message}`);
      } catch (err) {
        console.log("   ❌ Delete Sweet: FAILED");
        console.log(`   Error: ${err.response?.data?.error?.message || err.message}`);
        if (err.response?.status === 403) {
          console.log("   ⚠️  Admin access required");
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Endpoint testing completed!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
  }
}

testEndpoints();

