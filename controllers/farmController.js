const mongoose = require("mongoose");
const Farm = require(`${__dirname}/../models/farm`);
const User = require(`${__dirname}/../models/user`);

exports.addFarm = async (req, res) => {
  try {
    const { name, farmer, location, size, soil_type } = req.body;

    if (!name || !farmer || !size || !location) {
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

    if (size <= 0) {
      return res.status(400).send("Farm size must be greater than zero");
    }

    const newFarm = await Farm.create({
      name: name,
      farmer: farmer,
      location: {
        lat: location.lat,
        lon: location.lon,
      },
      size: size,
      soil_type: soil_type || "red Mediterranean soil",
    });

    res.send(newFarm);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.modifyFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    let { name, location, size, soil_type } = req.body;

    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).send("No such farm");
    }
    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access denied!");
    }
    if (size !== undefined && size <= 0) {
      return res.status(400).send("Farm size must be greater than zero");
    }

    const updatedFarm = await Farm.updateOne(
      { _id: id },
      {
        name: name || farm.name,
        location: {
          lat: location && location.lat !== undefined ? location.lat : farm.location?.lat,
          lon: location && location.lon !== undefined ? location.lon : farm.location?.lon,
        },
        size: size !== undefined ? size : farm.size,
        soil_type: soil_type || farm.soil_type,
      },
    );

    res.send(updatedFarm);
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

    const farm = await Farm.findById(id);

    if (!farm) {
      return res.status(404).send("No such farm");
    }

    if (farm.farmer.toString() != req.user.id) {
      return res.status(400).send("Access danied!");
    }
    res.send(farm);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.getAll = async (req, res) => {
  try {
    const farmer_id = req.user.id;
    const user = await User.findOne({ _id: farmer_id });
    if (!user) {
      return res.status(404).send("No such farmer");
    }
    const farms = await Farm.find({ farmer: user._id });

    res.send(farms);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }
    const farm = await Farm.findOne({ _id: id });
    if (!farm) {
      return res.status(404).send("No such farm");
    }
    if (farm.farmer.toString() !== req.user.id) {
      return res.status(400).send("Access danied!");
    }
    const deletedFarm = await Farm.deleteOne({ _id: id });
    res.send(deletedFarm);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
