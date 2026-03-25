const mongoose = require("mongoose");
const Crop = require(`${__dirname}/../models/crop`);
const Farm = require(`${__dirname}/../models/farm`);

exports.add = async (req, res) => {
  try {
    const { name, farm, status, planting_date, expected_harvest_date, actual_harvest_date } = req.body;

    if (!name || !farm || !status || !planting_date) {
      return res.status(400).send("Invalid parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(farm)) {
      return res.status(400).send("Invalid farm ID");
    }

    const existingFarm = await Farm.findById(farm);
    if (!existingFarm) {
      return res.status(404).send("No such farm");
    }

    const allowedStatus = ["planted", "growing", "ready", "harvested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const newCrop = await Crop.create({
      name: name,
      farm: farm,
      status: status,
      planting_date: planting_date,
      expected_harvest_date: expected_harvest_date,
      actual_harvest_date: actual_harvest_date,
    });

    res.send(newCrop);
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

    let { name, farm, status, planting_date, expected_harvest_date, actual_harvest_date } = req.body;

    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).send("No such crop");
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

    const allowedStatus = ["planted", "growing", "ready", "harvested"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const updatedCrop = await Crop.updateOne(
      { _id: id },
      {
        name: name || crop.name,
        farm: farm || crop.farm,
        status: status || crop.status,
        planting_date: planting_date || crop.planting_date,
        expected_harvest_date: expected_harvest_date !== undefined ? expected_harvest_date : crop.expected_harvest_date,
        actual_harvest_date: actual_harvest_date !== undefined ? actual_harvest_date : crop.actual_harvest_date,
      },
    );

    res.send(updatedCrop);
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

    const crop = await Crop.findById(id).populate({
      path: "farm",
      populate: {
        path: "farmer",
        select: "-password",
      },
    });

    if (!crop) {
      return res.status(404).send("No such crop");
    }

    res.send(crop);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getAll = async (req, res) => {
  try {
    const { farm } = req.params;

    if (!farm) {
      return res.status(400).send("Invalid parameters");
    }

    if (!mongoose.Types.ObjectId.isValid(farm)) {
      return res.status(400).send("Invalid farm ID");
    }

    const existingFarm = await Farm.findById(farm);
    if (!existingFarm) {
      return res.status(404).send("No such farm");
    }

    const crops = await Crop.find({ farm: farm }).populate({
      path: "farm",
      populate: {
        path: "farmer",
        select: "-password",
      },
    });

    res.send(crops);
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

    const deletedCrop = await Crop.deleteOne({ _id: id });

    if (deletedCrop.deletedCount === 0) {
      return res.status(404).send("No such crop");
    }

    res.send(deletedCrop);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
