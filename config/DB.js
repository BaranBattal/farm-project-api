const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MongoDB_URL = process.env.MongoDB_URL;
    await mongoose.connect(MongoDB_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
