const express = require("express");
const router = express.Router();

const farmActivityController = require(`${__dirname}/../controllers/farmActivityController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, farmActivityController.add);
router.patch("/:id", authMiddleware, farmActivityController.modify);
router.get("/id/:id", authMiddleware, farmActivityController.getByID);
router.get("/username/:farmer", authMiddleware, farmActivityController.getAll);
router.delete("/:id", authMiddleware, farmActivityController.deleteByID);

module.exports = router;
