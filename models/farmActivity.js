const mongoose = require("mongoose");

const farmActivitySchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    activity_type: {
      type: String,
      required: true,
      enum: ["planting", "watering", "pesticide", "harvest", "fertilizing"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["ton", "kg", "gram", "liter", "ml", "tree", "meter"],
    },
    activity_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FarmActivty", farmActivitySchema);
