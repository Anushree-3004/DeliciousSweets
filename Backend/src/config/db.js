const mongoose = require("mongoose");

async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    const err = new Error("MONGODB_URI is required");
    err.status = 500;
    err.code = "CONFIG_ERROR";
    throw err;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDB;