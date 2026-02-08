const Commit = require("../models/commitModel");
const Repository = require("../models/repoModel");

/* ================================
   CREATE COMMIT
================================ */

async function createCommit(req, res) {
  const { id } = req.params; // repo id
  const { message, filesChanged } = req.body;
  const userId = req.user.id;

  try {
    if (!message) {
      return res.status(400).json({ error: "Commit message required" });
    }

    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    const commit = await Commit.create({
      message,
      filesChanged,
      repository: id,
      author: userId,
    });

    // Update repo content list
    if (filesChanged && filesChanged.length) {
      repo.content = [...new Set([...repo.content, ...filesChanged])];
      await repo.save();
    }

    res.status(201).json(commit);
  } catch (err) {
    console.error("Commit create error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   GET COMMITS FOR A REPO
================================ */

async function getCommitsByRepo(req, res) {
  const { id } = req.params;

  try {
    const commits = await Commit.find({ repository: id })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(commits);
  } catch (err) {
    console.error("Fetch commits error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createCommit,
  getCommitsByRepo,
};
