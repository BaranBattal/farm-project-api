const mongoose = require("mongoose");
const Goods = require(`${__dirname}/../models/goods`);
const User = require(`${__dirname}/../models/user`);

exports.add = async (req, res) => {
  try {
    const { name, farmer, price, quantity_available, unit, status } = req.body;

    if (!name || !farmer || !price || !quantity_available || !unit || !status) {
      return res.status(400).send("Invalid parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(farmer)) {
      return res.status(400).send("Invalid farmer ID");
    }

    const existingFarmer = await User.findById(farmer);
    if (!existingFarmer) {
      return res.status(404).send("No such farmer");
    }

    if (existingFarmer.role !== "farmer") {
      return res.status(400).send("This user is not a farmer");
    }

    const allowedUnits = ["kg", "gram", "ton", "box", "bag", "piece"];
    if (!allowedUnits.includes(unit)) {
      return res.status(400).send("Invalid unit");
    }

    const allowedStatus = ["Sold", "available"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    if (price <= 0 || quantity_available <= 0) {
      return res.status(400).send("Price and quantity must be greater than zero");
    }

    const newGood = await Goods.create({
      name: name,
      farmer: farmer,
      price: price,
      quantity_available: quantity_available,
      unit: unit,
      status: status,
    });

    res.send(newGood);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.modify = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    let { name, price, quantity_available, unit, status } = req.body;

    const good = await Goods.findById(id);
    if (!good) {
      return res.status(404).send("No such good");
    }

    const allowedUnits = ["kg", "gram", "ton", "box", "bag", "piece"];
    if (unit && !allowedUnits.includes(unit)) {
      return res.status(400).send("Invalid unit");
    }

    const allowedStatus = ["Sold", "available"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).send("Price must be greater than zero");
    }

    if (quantity_available !== undefined && quantity_available < 0) {
      return res.status(400).send("Quantity cannot be negative");
    }

    const updatedGood = await Goods.updateOne(
      { _id: id },
      {
        name: name || good.name,
        farmer: farmer || good.farmer,
        price: price !== undefined ? price : good.price,
        quantity_available: quantity_available !== undefined ? quantity_available : good.quantity_available,
        unit: unit || good.unit,
        status: status || good.status,
      },
    );

    res.send(updatedGood);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    const good = await Goods.findById(id);

    if (!good) {
      return res.status(404).send("No such good");
    }

    res.send(good);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getAllByFarmer = async (req, res) => {
  try {
    const { farmer } = req.params;

    if (!farmer) {
      return res.status(400).send("Invalid parameters");
    }

    const user = await User.findOne({ username: farmer });
    if (!user) {
      return res.status(404).send("No such farmer");
    }

    const goods = await Goods.find({ farmer: user._id });

    res.send(goods);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }
    const good = Goods.findOne({ _id: id });
    if (!good) {
      res.status(404).send("No such good");
    }
    if (req.user.id != good.farmer) {
      res.status(400).send("Access danied!");
    }
    const deletedGood = await Goods.deleteOne({ _id: id });
    res.send(deletedGood);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
