const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    good_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goods",
      required: true,
    },
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "shipped", "delivered", "cancelled"],
    },
    delivery_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Orders", ordersSchema);
