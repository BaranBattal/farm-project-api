const express = require("express");
const router = express.Router();

const farmActivityController = require(`${__dirname}/../controllers/farmActivityController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, farmActivityController.addActivity);
router.patch("/id/:id", authMiddleware, farmActivityController.modifyActivity);
router.get("/id/:id", authMiddleware, farmActivityController.getByID);
router.get("/farm/:farm_id", authMiddleware, farmActivityController.getAll);
router.delete("/id/:id", authMiddleware, farmActivityController.deleteActivity);

module.exports = router;
