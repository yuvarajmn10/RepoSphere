const express = require("express");
const commitController = require("../controllers/commitController");
const authMiddleware = require("../middleware/authMiddleware");

const commitRouter = express.Router();

// create commit
commitRouter.post("/commit/:id", authMiddleware, commitController.createCommit);

// get repo commits
commitRouter.get("/commit/:id", authMiddleware, commitController.getCommitsByRepo);

module.exports = commitRouter;
