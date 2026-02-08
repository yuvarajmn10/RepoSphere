const Commit = require("../models/commitModel");

/* ================================
   USER CONTRIBUTION GRAPH
================================ */

async function getUserActivity(req, res) {
  const userId = req.user.id;

  try {
    const commits = await Commit.find({ author: userId });

    const activityMap = {};

    commits.forEach((commit) => {
      const date = commit.createdAt.toISOString().split("T")[0];

      if (!activityMap[date]) {
        activityMap[date] = 0;
      }

      activityMap[date] += 1;
    });

    const activityData = Object.keys(activityMap).map((date) => ({
      date,
      count: activityMap[date],
    }));

    res.json(activityData);
  } catch (err) {
    console.error("Activity fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getUserActivity,
};
