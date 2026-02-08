const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");

/* ================================
   CREATE REPOSITORY
================================ */

async function createRepository(req, res) {
  const { name, description, visibility } = req.body;
  const owner = req.user.id;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name required" });
    }

    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const repo = await Repository.create({
      name,
      description,
      visibility,
      owner,
      content: [],
      issues: [],
    });

    user.repositories.push(repo._id);
    await user.save();

    res.status(201).json(repo);
  } catch (err) {
    console.error("Repo create error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   GET ALL REPOS
================================ */

async function getAllRepositories(req, res) {
  try {
    const repos = await Repository.find()
      .populate("owner", "username email")
      .populate("issues");

    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   GET USER REPOS
================================ */

async function fetchRepositoriesForCurrentUser(req, res) {
  const owner = req.user.id;

  try {
    const repos = await Repository.find({ owner })
      .populate("owner", "username");

    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   GET SINGLE REPO
================================ */

async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repo = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues");

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    res.json(repo);
  } catch (err) {
    console.error("Repo fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   DELETE REPOSITORY ⭐
================================ */

async function deleteRepository(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    // only owner can delete
    if (repo.owner.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this repo" });
    }

    await Repository.findByIdAndDelete(id);

    // remove repo from user's repo list
    await User.findByIdAndUpdate(userId, {
      $pull: { repositories: id }
    });

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Repo delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ===============================
   STAR REPOSITORY
================================ */

async function starRepository(req, res) {
  const userId = req.user.id;
  const { repoId } = req.params;

  try {
    const user = await User.findById(userId);
    const repo = await Repository.findById(repoId);

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    if (user.starRepos.includes(repoId)) {
      return res.status(400).json({ error: "Already starred" });
    }

    user.starRepos.push(repoId);
    await user.save();

    res.json({ message: "Repo starred" });
  } catch (err) {
    console.error("Star repo error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ===============================
   UNSTAR REPOSITORY
================================ */

async function unstarRepository(req, res) {
  const userId = req.user.id;
  const { repoId } = req.params;

  try {
    const user = await User.findById(userId);

    user.starRepos = user.starRepos.filter(
      (id) => id.toString() !== repoId
    );

    await user.save();

    res.json({ message: "Repo unstarred" });
  } catch (err) {
    console.error("Unstar repo error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ===============================
   GET STARRED REPOS
================================ */

async function getStarredRepositories(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "starRepos",
        populate: { path: "owner", select: "username" },
      });

    res.json(user.starRepos);
  } catch (err) {
    console.error("Fetch starred repos error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoriesForCurrentUser,
  fetchRepositoryById,
  deleteRepository,
  starRepository,
  unstarRepository,
  getStarredRepositories
};
