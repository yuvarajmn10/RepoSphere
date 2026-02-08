const express = require("express");
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");
const commitRouter = require("./commit.router");
const activityRouter = require("./activity.router");


const mainRouter = express.Router();

mainRouter.use("/auth", userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(commitRouter);
mainRouter.use(activityRouter);


mainRouter.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = mainRouter;
