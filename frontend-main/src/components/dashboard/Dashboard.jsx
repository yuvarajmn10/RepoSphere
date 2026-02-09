import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  /* ===============================
     FETCH USER REPOS
  ============================== */

  useEffect(() => {
    const fetchUserRepositories = async () => {
      try {
        const res = await API.get("/repo/user");

        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRepositories(sorted);
      } catch (err) {
        console.error("Repo fetch error:", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await API.get("/repo/all");

        const unique = Array.from(
          new Map(res.data.map(repo => [repo._id, repo])).values()
        );

        setSuggestedRepositories(unique);
      } catch (err) {
        console.error("Suggested repo error:", err);
        setSuggestedRepositories([]);
      }
    };

    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, []);

  /* ===============================
     INSTANT SEARCH FILTER
  ============================== */

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(repositories);
      return;
    }

    const filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchQuery, repositories]);

  /* ===============================
     DELETE REPO
  ============================== */

  const handleDeleteRepo = async (repoId) => {
    try {
      await API.delete(`/repo/delete/${repoId}`);

      setRepositories(prev => prev.filter(r => r._id !== repoId));
      setSearchResults(prev => prev.filter(r => r._id !== repoId));
    } catch {
      alert("Delete failed");
    }
  };

  /* ===============================
     STAR
  ============================== */

  const handleStar = async (repoId) => {
    try {
      await API.post(`/repo/star/${repoId}`);
      alert("Repo starred ⭐");
    } catch {
      alert("Already starred");
    }
  };

  /* ===============================
     UI
  ============================== */

  return (
    <>
      <Navbar />

      <section id="dashboard">

        {/* LEFT: Suggested */}
        <aside>
          <h3>Suggested Repositories</h3>

          {suggestedRepositories.map(repo => (
            <div className="repo-card" key={repo._id}>
              <div onClick={() => navigate(`/repo/${repo._id}`)}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <small>Owner: {repo.owner?.username}</small>
              </div>

              <div className="repo-actions">
                <button onClick={() => handleStar(repo._id)}>⭐ Star</button>
                <button onClick={() =>
                  setSuggestedRepositories(prev =>
                    prev.filter(r => r._id !== repo._id)
                  )
                }>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </aside>

        {/* CENTER */}
        <main>

          <h2>Your Repositories</h2>

          {/* PREMIUM SEARCH BAR */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* RESULTS */}
          {searchResults.map(repo => (
            <div className="repo-card" key={repo._id}>

              <div onClick={() => navigate(`/repo/${repo._id}`)}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <small>Owner: You</small>
              </div>

              <div className="repo-actions">
                <button onClick={() => handleDeleteRepo(repo._id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}

        </main>

        {/* RIGHT */}
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>Tech Conference</li>
            <li>Developer Meetup</li>
            <li>React Summit</li>
          </ul>
        </aside>

      </section>
      {/* END SECTION (visual footer) */}
      <div className="dashboard-end">
        <div className="dashboard-end-inner">
            <h4>You're all caught up</h4>
            <p> No more repositories to show. Build. Commit. Ship.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
