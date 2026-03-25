const express = require("express");
const router = express.Router();

const goodsController = require(`${__dirname}/../controllers/goodsController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, goodsController.add);
router.patch("/:id", authMiddleware, goodsController.modify);
router.get("/id/:id", authMiddleware, goodsController.getByID);
router.get("/username/:farmer", authMiddleware, goodsController.getAllByFarmer);
router.get("/", goodsController.getAll);
router.delete("/:id", authMiddleware, goodsController.deleteByID);

module.exports = router;
