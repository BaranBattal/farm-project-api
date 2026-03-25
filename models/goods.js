const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    quantity_available: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "gram", "ton", "box", "bag", "piece"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Sold", "available"],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Goods", goodsSchema);
