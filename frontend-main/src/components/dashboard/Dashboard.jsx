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

  // FETCH DATA
  useEffect(() => {
    const fetchUserRepositories = async () => {
      try {
        const res = await API.get("/repo/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRepositories(res.data || []);
      } catch (err) {
        console.error("Repo fetch error:", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await API.get("/repo/all");

        const uniqueRepos = Array.from(
          new Map(res.data.map(repo => [repo._id, repo])).values()
        );

        setSuggestedRepositories(uniqueRepos);
      } catch (err) {
        console.error("Suggested repo error:", err);
        setSuggestedRepositories([]);
      }
    };

    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    if (!Array.isArray(repositories)) return;

    if (!searchQuery) {
      setSearchResults(repositories);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  // DELETE REPO
  const handleDeleteRepo = async (repoId) => {
    try {
      await API.delete(`/repo/delete/${repoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRepositories(prev => prev.filter(repo => repo._id !== repoId));
      setSearchResults(prev => prev.filter(repo => repo._id !== repoId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete repository");
    }
  };

  // REMOVE SUGGESTION (frontend only)
  const removeSuggestion = (repoId) => {
    setSuggestedRepositories(prev =>
      prev.filter(repo => repo._id !== repoId)
    );
  };

  return (
    <>
      <Navbar />

      <section id="dashboard">

        {/* SUGGESTED */}
        <aside>
          <h3>Suggested Repositories</h3>

          {suggestedRepositories.map((repo) => (
            <div className="repo-card" key={repo._id}>
              <div onClick={() => navigate(`/repo/${repo._id}`)}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <small>Owner: {repo.owner?.username}</small>
              </div>

              <button onClick={() => removeSuggestion(repo._id)}>
                Remove
              </button>
            </div>
          ))}
        </aside>

        {/* USER REPOS */}
        <main>
          <h2>Your Repositories</h2>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.map((repo) => (
            <div className="repo-card" key={repo._id}>

              <div onClick={() => navigate(`/repo/${repo._id}`)}>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <small>Owner: {repo.owner?.username || "You"}</small>
              </div>

              <button onClick={() => handleDeleteRepo(repo._id)}>
                Delete
              </button>

            </div>
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference - Dec 15</p></li>
            <li><p>Developer Meetup - Dec 25</p></li>
            <li><p>React Summit - Jan 5</p></li>
          </ul>
        </aside>

      </section>
    </>
  );
};

export default Dashboard;
