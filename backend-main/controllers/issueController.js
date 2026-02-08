const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");

async function createIssue(req, res) {
  const { title, description, repositoryId } = req.body;
  const userId = req.user.id;

  try {
    const issue = await Issue.create({
      title,
      description,
      repository: repositoryId,
      createdBy: userId,
    });

    await Repository.findByIdAndUpdate(repositoryId, {
      $push: { issues: issue._id },
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find()
      .populate("repository")
      .populate("createdBy", "username");

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
};
