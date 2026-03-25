const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    soil_type: {
      type: String,
      default: "red Mediterranean soil",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Farm", farmSchema);
