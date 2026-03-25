const mongoose = require("mongoose");
const FarmActivity = require(`${__dirname}/../models/farmActivity`);
const Farm = require(`${__dirname}/../models/farm`);
const Crop = require(`${__dirname}/../models/crop`);
const User = require(`${__dirname}/../models/user`);

exports.add = async (req, res) => {
  try {
    const { farm, crop, activity_type, quantity, unit, activity_date } = req.body;

    if (!farm || !crop || !activity_type || !quantity || !unit || !activity_date) {
      return res.status(400).send("Invalid parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(farm)) {
      return res.status(400).send("Invalid farm ID");
    }

    if (!mongoose.Types.ObjectId.isValid(crop)) {
      return res.status(400).send("Invalid crop ID");
    }

    const existingFarm = await Farm.findById(farm);
    if (!existingFarm) {
      return res.status(404).send("No such farm");
    }

    const existingCrop = await Crop.findById(crop);
    if (!existingCrop) {
      return res.status(404).send("No such crop");
    }

    const allowedTypes = ["planting", "watering", "pesticide", "harvest", "fertilizing"];
    if (!allowedTypes.includes(activity_type)) {
      return res.status(400).send("Invalid activity type");
    }

    const allowedUnits = ["ton", "kg", "gram", "liter", "ml", "tree", "meter"];
    if (!allowedUnits.includes(unit)) {
      return res.status(400).send("Invalid unit");
    }

    if (quantity <= 0) {
      return res.status(400).send("Quantity must be greater than zero");
    }

    const newFarmActivity = await FarmActivity.create({
      farm: farm,
      crop: crop,
      activity_type: activity_type,
      quantity: quantity,
      unit: unit,
      activity_date: activity_date,
    });

    res.send(newFarmActivity);
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

    let { farm, crop, activity_type, quantity, unit, activity_date } = req.body;

    const farmActivity = await FarmActivity.findById(id);
    if (!farmActivity) {
      return res.status(404).send("No such farm activity");
    }

    if (farm) {
      if (!mongoose.Types.ObjectId.isValid(farm)) {
        return res.status(400).send("Invalid farm ID");
      }

      const existingFarm = await Farm.findById(farm);
      if (!existingFarm) {
        return res.status(404).send("No such farm");
      }
    }

    if (crop) {
      if (!mongoose.Types.ObjectId.isValid(crop)) {
        return res.status(400).send("Invalid crop ID");
      }

      const existingCrop = await Crop.findById(crop);
      if (!existingCrop) {
        return res.status(404).send("No such crop");
      }
    }

    const allowedTypes = ["planting", "watering", "pesticide", "harvest", "fertilizing"];
    if (activity_type && !allowedTypes.includes(activity_type)) {
      return res.status(400).send("Invalid activity type");
    }

    const allowedUnits = ["ton", "kg", "gram", "liter", "ml", "tree", "meter"];
    if (unit && !allowedUnits.includes(unit)) {
      return res.status(400).send("Invalid unit");
    }

    if (quantity !== undefined && quantity <= 0) {
      return res.status(400).send("Quantity must be greater than zero");
    }

    const updatedFarmActivity = await FarmActivity.updateOne(
      { _id: id },
      {
        farm: farm || farmActivity.farm,
        crop: crop || farmActivity.crop,
        activity_type: activity_type || farmActivity.activity_type,
        quantity: quantity !== undefined ? quantity : farmActivity.quantity,
        unit: unit || farmActivity.unit,
        activity_date: activity_date || farmActivity.activity_date,
      },
    );

    res.send(updatedFarmActivity);
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

    const farmActivity = await FarmActivity.findById(id)
      .populate({
        path: "farm",
        populate: {
          path: "farmer",
          select: "-password",
        },
      })
      .populate("crop");

    if (!farmActivity) {
      return res.status(404).send("No such farm activity");
    }

    res.send(farmActivity);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getAll = async (req, res) => {
  try {
    const { farmer } = req.params;

    if (!farmer) {
      return res.status(400).send("Invalid parameters");
    }

    const user = await User.findOne({ username: farmer });
    if (!user) {
      return res.status(404).send("No such farmer");
    }

    const farms = await Farm.find({ farmer: user._id }).select("_id");
    const farmIds = farms.map((farm) => farm._id);

    const farmActivities = await FarmActivity.find({
      farm: { $in: farmIds },
    })
      .populate({
        path: "farm",
        populate: {
          path: "farmer",
          select: "-password",
        },
      })
      .populate("crop");

    res.send(farmActivities);
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

    const deletedFarmActivity = await FarmActivity.deleteOne({ _id: id });

    if (deletedFarmActivity.deletedCount === 0) {
      return res.status(404).send("No such farm activity");
    }

    res.send(deletedFarmActivity);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
