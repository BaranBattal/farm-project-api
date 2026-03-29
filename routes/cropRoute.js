const express = require("express");
const router = express.Router();

const cropController = require(`${__dirname}/../controllers/cropController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, cropController.addCrop);
router.patch("/id/:id", authMiddleware, cropController.modifyCrop);
router.get("/id/:id", authMiddleware, cropController.getByID);
router.get("/farm/:farm_id", authMiddleware, cropController.getAll);
router.delete("/id/:id", authMiddleware, cropController.deleteCrop);

module.exports = router;
