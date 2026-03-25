const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["planted", "growing", "ready", "harvested"],
    },
    planting_date: {
      type: Date,
      required: true,
    },
    expected_harvest_date: {
      type: Date,
    },
    actual_harvest_date: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Crop", cropSchema);
