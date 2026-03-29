const mongoose = require("mongoose");
const Crop = require(`${__dirname}/../models/crop`);
const Farm = require(`${__dirname}/../models/farm`);
const estimateExpectedHarvestDate = require(`${__dirname}/../services/ai`);
const getWeatherSummary = require(`${__dirname}/../services/weather`);

exports.addCrop = async (req, res) => {
  try {
    const { name, farm, status, planting_date, actual_harvest_date } = req.body;

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
    const weather = await getWeatherSummary(existingFarm.location.lat, existingFarm.location.lon);
    const expected_harvest_date = await estimateExpectedHarvestDate(name, planting_date, weather, existingFarm);
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

exports.modifyCrop = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    let { name, farm, status, planting_date, actual_harvest_date } = req.body;
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).send("No such crop");
    }
    let expected_harvest_date = crop.expected_harvest_date;
    let existingFarm = await Farm.findById(crop.farm);
    if (farm) {
      if (!mongoose.Types.ObjectId.isValid(farm)) {
        return res.status(400).send("Invalid farm ID");
      }

      existingFarm = await Farm.findById(farm);
      if (!existingFarm) {
        return res.status(404).send("No such farm");
      }
      if (existingFarm.farmer !== req.user.id) {
        return res.status(400).send("Access denied!");
      }
    }
    if (name || planting_date || farm) {
      const weather = await getWeatherSummary(existingFarm.location.lat, existingFarm.location.lon);
      expected_harvest_date = await estimateExpectedHarvestDate(name, planting_date, weather, existingFarm);
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
        expected_harvest_date: expected_harvest_date,
        actual_harvest_date: actual_harvest_date || crop.actual_harvest_date,
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

    const crop = await Crop.findById(id);

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
    const { farm_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farm_id)) {
      return res.status(400).send(`Invalid ID ${farm_id}`);
    }

    const farm = await Farm.findById(farm_id);

    if (!farm) {
      return res.status(404).send("No such farm");
    }

    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const crops = await Crop.find({ farm: farm_id });
    res.send(crops);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).send("No such crop");
    }
    const farm = await Farm.findById(crop.farm);
    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    const deletedCrop = await Crop.deleteOne({ _id: id });
    res.send(deletedCrop);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
