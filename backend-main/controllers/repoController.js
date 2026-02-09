const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Commit = require("../models/commitModel");

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
    if (!user) return res.status(404).json({ error: "User not found" });

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
   REPO STATS ENGINE
================================ */

async function attachRepoStats(repo, userId = null) {
  const commitCount = await Commit.countDocuments({ repository: repo._id });
  const issueCount = repo.issues?.length || 0;

  let starred = false;

  if (userId) {
    const user = await User.findById(userId);

    if (user?.starRepos?.length) {
      starred = user.starRepos.some(
        (id) => id.toString() === repo._id.toString()
      );
    }
  }

  return {
    ...repo.toObject(),
    stats: {
      commits: commitCount,
      issues: issueCount,
      stars: 0,
    },
    starred,
  };
}

/* ================================
   GET ALL REPOS (SUGGESTED)
================================ */

async function getAllRepositories(req, res) {
  try {
    const userId = req.user?.id;

    let repos = await Repository.find()
      .sort({ createdAt: -1 }) // newest first
      .populate("owner", "username");

    // remove duplicates
    const uniqueMap = new Map();
    repos.forEach(r => uniqueMap.set(r._id.toString(), r));
    repos = Array.from(uniqueMap.values());

    // remove own repos from suggestions
    if (userId) {
      repos = repos.filter(r => r.owner._id.toString() !== userId);
    }

    // attach stats
    const enriched = await Promise.all(
      repos.map(repo => attachRepoStats(repo, userId))
    );

    res.json(enriched);
  } catch (err) {
    console.error("Fetch repos error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   USER REPOSITORIES
================================ */

async function fetchRepositoriesForCurrentUser(req, res) {
  const owner = req.user.id;

  try {
    const repos = await Repository.find({ owner })
      .sort({ createdAt: -1 })
      .populate("owner", "username");

    const enriched = await Promise.all(
      repos.map(repo => attachRepoStats(repo, owner))
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   SINGLE REPO DETAILS
================================ */

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const repo = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues");

    if (!repo) return res.status(404).json({ error: "Repository not found" });

    const enriched = await attachRepoStats(repo, userId);

    res.json(enriched);
  } catch (err) {
    console.error("Repo fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   DELETE REPOSITORY
================================ */

async function deleteRepository(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ error: "Repository not found" });
    }

    if (repo.owner.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Repository.findByIdAndDelete(id);

    await User.findByIdAndUpdate(userId, {
      $pull: { repositories: id },
    });

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Repo delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   STAR REPO
================================ */

async function starRepository(req, res) {
  const userId = req.user.id;
  const { repoId } = req.params;

  try {
    const user = await User.findById(userId);

    const alreadyStarred = user.starRepos.some(
      (id) => id.toString() === repoId
    );

    if (alreadyStarred) {
      return res.status(400).json({ error: "Already starred" });
    }

    user.starRepos.push(repoId);
    await user.save();

    res.json({ message: "Repo starred" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


/* ================================
   UNSTAR REPO
================================ */

async function unstarRepository(req, res) {
  const userId = req.user.id;
  const { repoId } = req.params;

  try {
    const user = await User.findById(userId);

    user.starRepos = user.starRepos.filter(
      id => id.toString() !== repoId
    );

    await user.save();

    res.json({ message: "Repo unstarred" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================================
   GET STARRED REPOS (BULLETPROOF)
================================ */
async function getStarredRepositories(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if empty → return empty safely
    if (!user.starRepos || user.starRepos.length === 0) {
      return res.json([]);
    }

    // fetch repos safely
    const repos = await Repository.find({
      _id: { $in: user.starRepos },
    }).populate("owner", "username email");

    return res.json(repos);
  } catch (err) {
    console.error("🔥 STARRED API CRASH:", err);
    return res.status(500).json({
      error: "Starred repo fetch failed",
      details: err.message,
    });
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
  getStarredRepositories,
};
