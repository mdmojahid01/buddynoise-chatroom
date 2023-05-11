const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

async function DbConnect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
}

module.exports = DbConnect;
