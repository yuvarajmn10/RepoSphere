import React, { useEffect, useState } from "react";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, logout } = useAuth();
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===============================
     FETCH STARRED REPOS
  ============================== */

  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const res = await API.get("/repo/starred", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setStarredRepos(res.data || []);
      } catch (err) {
        console.error("Starred repo fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarred();
  }, []);

  return (
    <>
      <Navbar />

      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item icon={BookIcon}>
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item icon={RepoIcon}>
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <button
        onClick={logout}
        style={{ position: "fixed", bottom: "50px", right: "50px" }}
        id="logout"
      >
        Logout
      </button>

      <div className="profile-page-wrapper">

        {/* LEFT PANEL */}
        <div className="user-profile-section">

          <img
            className="profile-image"
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="profile"
          />

          <div className="name">
            <h3>{username || "User"}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="heat-map-section">

          <HeatMapProfile />

          <h3 style={{ marginTop: "30px" }}>⭐ Starred Repositories</h3>

          {loading ? (
            <p>Loading starred repos...</p>
          ) : starredRepos.length === 0 ? (
            <p>No starred repositories yet.</p>
          ) : (
            <div className="repo-card-wrapper">
              {starredRepos.map((repo) => (
                <div
                  key={repo._id}
                  className="repo"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <h4 className="repo-name">{repo.name}</h4>

                  <p className="description">
                    {repo.description || "No description"}
                  </p>

                  <p>Owner: {repo.owner?.username}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;
