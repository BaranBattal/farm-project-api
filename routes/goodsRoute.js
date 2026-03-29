const express = require("express");
const router = express.Router();

const goodsController = require(`${__dirname}/../controllers/goodsController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, goodsController.addGood);
router.patch("/id/:id", authMiddleware, goodsController.modifyGood);
router.get("/id/:id", authMiddleware, goodsController.getByID);
router.get("/farmer/:farmer", authMiddleware, goodsController.getByFarmer);
router.delete("/id/:id", authMiddleware, goodsController.deleteGood);

module.exports = router;
