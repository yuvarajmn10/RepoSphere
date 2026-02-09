const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/authMiddleware");

const repoRouter = express.Router();

repoRouter.post("/repo/create", authMiddleware, repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/user", authMiddleware, repoController.fetchRepositoriesForCurrentUser);

// ABOVE /repo/:id 
repoRouter.get("/repo/starred", authMiddleware, repoController.getStarredRepositories);
repoRouter.post("/repo/star/:repoId", authMiddleware, repoController.starRepository);
repoRouter.delete("/repo/star/:repoId", authMiddleware, repoController.unstarRepository);

// SINGLE REPO SHOULD ALWAYS BE LAST 
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.delete("/repo/delete/:id", authMiddleware, repoController.deleteRepository);

module.exports = repoRouter;
