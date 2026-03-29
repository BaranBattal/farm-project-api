const express = require("express");
const router = express.Router();

const ordersController = require(`${__dirname}/../controllers/ordersController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, ordersController.addOrder);
router.patch("/id/:id", authMiddleware, ordersController.modifyOrder);
router.get("/id/:id", authMiddleware, ordersController.getOrder);
router.delete("/id/:id", authMiddleware, ordersController.deleteOrder);

module.exports = router;
