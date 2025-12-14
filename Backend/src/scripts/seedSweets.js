require("dotenv").config();
const connectDB = require("../config/db");
const Sweet = require("../models/Sweet");

const sampleSweets = [
  {
    name: "Gulab Jamun",
    category: "Indian",
    price: 25,
    quantity: 50,
  },
  {
    name: "Rasgulla",
    category: "Indian",
    price: 20,
    quantity: 40,
  },
  {
    name: "Ladoo",
    category: "Indian",
    price: 30,
    quantity: 35,
  },
  {
    name: "Jalebi",
    category: "Indian",
    price: 35,
    quantity: 30,
  },
  {
    name: "Barfi",
    category: "Indian",
    price: 40,
    quantity: 25,
  },
  {
    name: "Kaju Katli",
    category: "Indian",
    price: 60,
    quantity: 20,
  },
  {
    name: "Chocolate Cake",
    category: "Western",
    price: 500,
    quantity: 10,
  },
  {
    name: "Red Velvet Cake",
    category: "Western",
    price: 600,
    quantity: 8,
  },
  {
    name: "Cheesecake",
    category: "Western",
    price: 450,
    quantity: 12,
  },
  {
    name: "Brownie",
    category: "Western",
    price: 80,
    quantity: 30,
  },
  {
    name: "Baklava",
    category: "Middle Eastern",
    price: 120,
    quantity: 15,
  },
  {
    name: "Halwa",
    category: "Indian",
    price: 50,
    quantity: 20,
  },
  {
    name: "Peda",
    category: "Indian",
    price: 35,
    quantity: 0, // Out of stock for testing
  },
  {
    name: "Soan Papdi",
    category: "Indian",
    price: 45,
    quantity: 18,
  },
  {
    name: "Kulfi",
    category: "Indian",
    price: 30,
    quantity: 25,
  },
];

async function seedSweets() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully!");

    console.log("\nClearing existing sweets...");
    await Sweet.deleteMany({});
    console.log("Existing sweets cleared.");

    console.log("\nAdding sample sweets...");
    const inserted = await Sweet.insertMany(sampleSweets);
    console.log(`\n✅ Successfully added ${inserted.length} sweets to the database!\n`);

    console.log("Added sweets:");
    inserted.forEach((sweet, index) => {
      console.log(
        `${index + 1}. ${sweet.name} (${sweet.category}) - ₹${sweet.price} - Stock: ${sweet.quantity}`
      );
    });

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding sweets:", error.message);
    if (error.code === 11000) {
      console.error("Duplicate key error - some sweets may already exist.");
    }
    process.exit(1);
  }
}

// Run the seed function
seedSweets();

