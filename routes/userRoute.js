const express = require("express");
const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/login", userController.login);
router.post("/register", userController.register);
router.patch("/username", authMiddleware, userController.update);
router.get("/all", authMiddleware, userController.getAllUsers);
router.get("/username/:username", authMiddleware, userController.getByUserName);
router.delete("/deleteMe", authMiddleware, userController.deleteMe);
router.delete("/all", authMiddleware, userController.deleteAll);

module.exports = router;
