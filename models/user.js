const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 80,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
      minlength: 4,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "admin", "farmer"],
      default: "buyer",
    },
    number: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
