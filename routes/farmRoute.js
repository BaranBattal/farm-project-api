const express = require("express");
const router = express.Router();

const farmController = require(`${__dirname}/../controllers/farmController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, farmController.add);
router.patch("/:id", authMiddleware, farmController.modify);
router.get("/id/:id", authMiddleware, farmController.getByID);
router.get("/username/:farmer", authMiddleware, farmController.getAll);
router.delete("/:id", authMiddleware, farmController.deleteByID);

module.exports = router;
