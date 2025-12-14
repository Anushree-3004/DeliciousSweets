const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema(
  {
    // MongoDB provides a unique _id automatically.
    // Also enforce unique sweet names to avoid duplicates in inventory.
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sweet", sweetSchema);