require("dotenv").config();

/**
 * Test script for PUT /api/sweets/:id
 * 
 * Usage: node src/scripts/testPutEndpoint.js <sweetId> <field1=value1> <field2=value2> ...
 * 
 * Example:
 *   node src/scripts/testPutEndpoint.js 693eef6146a3a0e4b564b768 price=35 quantity=30
 * 
 * Note: You need to login first and set the token in the script or use environment variable
 */

const SWEET_ID = process.argv[2] || "693eef6146a3a0e4b564b768";
const updates = {};

// Parse command line arguments
for (let i = 3; i < process.argv.length; i++) {
  const arg = process.argv[i];
  const [key, value] = arg.split("=");
  if (key && value !== undefined) {
    if (key === "price" || key === "quantity") {
      updates[key] = Number(value);
    } else {
      updates[key] = value;
    }
  }
}

// Default update if no arguments provided
if (Object.keys(updates).length === 0) {
  updates.price = 35;
  updates.quantity = 30;
}

console.log("Testing PUT /api/sweets/:id");
console.log("=".repeat(60));
console.log(`Sweet ID: ${SWEET_ID}`);
console.log(`Updates:`, updates);
console.log("\n⚠️  Note: This script requires a valid JWT token.");
console.log("   Please login through the frontend or use Postman/curl to test.");
console.log("\nExample PowerShell command:");
console.log(`
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body (@{email="your@email.com";password="yourpass"} | ConvertTo-Json) -ContentType "application/json"
$token = $login.token
$headers = @{Authorization="Bearer $token"}
$update = @{price=35;quantity=30} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/sweets/${SWEET_ID}" -Method Put -Body $update -ContentType "application/json" -Headers $headers
`);

process.exit(0);

