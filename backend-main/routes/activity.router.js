const express = require("express");
const activityController = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");

const activityRouter = express.Router();

activityRouter.get("/activity", authMiddleware, activityController.getUserActivity);

module.exports = activityRouter;
