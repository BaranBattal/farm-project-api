const express = require("express");
const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/login", userController.login);
router.post("/register", userController.register);
router.patch("/username", authMiddleware, userController.updateUser);
router.get("/username", authMiddleware, userController.getUser);
router.delete("/deleteMe", authMiddleware, userController.deleteUser);

module.exports = router;
