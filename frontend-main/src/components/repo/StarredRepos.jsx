import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const StarredRepos = () => {
  const [repos, setRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const res = await API.get("/user/starred", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRepos(res.data || []);
      } catch (err) {
        console.error("Starred fetch error:", err);
      }
    };

    fetchStarred();
  }, []);

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "auto", padding: "40px" }}>
        <h2>⭐ Starred Repositories</h2>

        {repos.length === 0 ? (
          <p style={{ color: "gray" }}>No starred repos yet</p>
        ) : (
          repos.map((repo) => (
            <div
              key={repo._id}
              style={{
                padding: "15px",
                border: "1px solid #30363d",
                borderRadius: "8px",
                marginBottom: "12px",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/repo/${repo._id}`)}
            >
              <h3>{repo.name}</h3>
              <p style={{ color: "gray" }}>{repo.description}</p>
              <p>Owner: {repo.owner?.username}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default StarredRepos;
