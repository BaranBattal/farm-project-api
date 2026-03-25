const express = require("express");
const router = express.Router();

const ordersController = require(`${__dirname}/../controllers/ordersController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/order", authMiddleware, ordersController.add);
router.patch("/:id", authMiddleware, ordersController.modify);
router.get("/id/:id", authMiddleware, ordersController.getByID);
router.delete("/id/:id", authMiddleware, ordersController.deleteByID);

module.exports = router;
