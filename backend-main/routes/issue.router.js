const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");

const issueRouter = express.Router();

issueRouter.post("/issue/create", authMiddleware, issueController.createIssue);
issueRouter.get("/issue/all", issueController.getAllIssues);

module.exports = issueRouter;
