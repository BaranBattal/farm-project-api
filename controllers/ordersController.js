const mongoose = require("mongoose");
const Orders = require(`${__dirname}/../models/orders`);
const User = require(`${__dirname}/../models/user`);
const Goods = require(`${__dirname}/../models/goods`);

exports.addOrder = async (req, res) => {
  try {
    const { good_id, buyer_id, quantity, unit_price, delivery_address } = req.body;

    if (!good_id || !buyer_id || !quantity || !unit_price || !delivery_address) {
      return res.status(400).send("Invalid parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(good_id)) {
      return res.status(400).send("Invalid good ID");
    }

    if (!mongoose.Types.ObjectId.isValid(buyer_id)) {
      return res.status(400).send("Invalid buyer ID");
    }

    const good = await Goods.findById(good_id);
    if (!good) {
      return res.status(404).send("No such good");
    }

    const buyer = await User.findById(buyer_id);
    if (!buyer) {
      return res.status(404).send("No such buyer");
    }
    if (quantity > good.quantity_available) {
      return res.send("not enough quantity");
    }
    await Goods.updateOne(
      { _id: good_id },
      {
        quantity_available: good.quantity_available - quantity,
      },
    );
    const total_price = quantity * unit_price;

    const newOrder = await Orders.create({
      good_id: good_id,
      buyer_id: buyer_id,
      quantity: quantity,
      unit_price: unit_price,
      total_price: total_price,
      status: "pending",
      delivery_address: delivery_address,
    });

    res.send(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.modifyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    let { status } = req.body;

    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).send("No such order");
    }
    if (order.buyer_id.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const allowedStatus = ["pending", "accepted", "shipped", "delivered", "cancelled"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }
    const updatedOrder = await Orders.updateOne(
      { _id: id },
      {
        status: status,
      },
    );
    res.send(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).send("No such order");
    }

    if (order.buyer_id.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    res.send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    const order = await Orders.findOne({ _id: id });

    if (!order) {
      return res.status(404).send("No such order");
    }
    if (order.buyer_id.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const deletedOrder = await Orders.deleteOne({ _id: id });
    res.send(deletedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
