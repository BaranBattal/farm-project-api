const express = require("express");
const router = express.Router();

const cropController = require(`${__dirname}/../controllers/cropController`);
const authMiddleware = require(`${__dirname}/../middlewares/auth`);

router.post("/add", authMiddleware, cropController.add);
router.patch("/:id", authMiddleware, cropController.modify);
router.get("/id/:id", authMiddleware, cropController.getByID);
router.get("/farm/id/:farm", authMiddleware, cropController.getAll);
router.delete("/:id", authMiddleware, cropController.deleteByID);

module.exports = router;
