const express = require("express");
const router = express.Router();

const farmController = require(`${__dirname}/../controllers/farmController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, farmController.addFarm);
router.patch("/id/:id", authMiddleware, farmController.modifyFarm);
router.get("/id/:id", authMiddleware, farmController.getByID);
router.get("/all", authMiddleware, farmController.getAll);
router.delete("/id/:id", authMiddleware, farmController.deleteFarm);

module.exports = router;
