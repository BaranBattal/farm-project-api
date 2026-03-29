const mongoose = require("mongoose");
const FarmActivity = require(`${__dirname}/../models/farmActivity`);
const Farm = require(`${__dirname}/../models/farm`);
const Crop = require(`${__dirname}/../models/crop`);
const User = require(`${__dirname}/../models/user`);

exports.addActivity = async (req, res) => {
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

exports.modifyActivity = async (req, res) => {
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
      if (farm.farmer.toString() !== req.user.id) {
        return res.status(400).send("Access denied!");
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

    const farmActivity = await FarmActivity.findById(id);

    if (!farmActivity) {
      return res.status(404).send("No such farm activity");
    }

    const farm = await Farm.findById(farmActivity.farm);
    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    res.send(farmActivity);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getAll = async (req, res) => {
  try {
    const { farm_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farm_id)) {
      return res.status(400).send("Invalid ID");
    }

    const farm = await Farm.findById(farm_id);

    if (!farm) {
      return res.status(404).send("No such farm");
    }

    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const activities = await FarmActivity.find({ farm: farm_id });
    res.send(activities);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }
    const farmActivity = await FarmActivity.findById(id);
    if (!farmActivity) {
      res.status(404).send("No such farm activity!");
    }
    const farm = await Farm.findById(farmActivity.farm);
    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const deletedFarmActivity = await FarmActivity.deleteOne({ _id: id });
    res.send(deletedFarmActivity);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
