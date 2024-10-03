const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connection Established");
  } catch (error) {
    console.log("[DATABASE_CONNECTION_ERROR]", error);
  }
}

module.exports = { connectDB };
