import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import API from "../../api/axios";

const RepoDetails = () => {
  const { id } = useParams();

  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [filesChanged, setFilesChanged] = useState("");

  /* ===============================
     FETCH REPO DETAILS
  ============================== */

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await API.get(`/repo/${id}`);
        setRepo(res.data);
      } catch (err) {
        console.error("Error fetching repo:", err);
      }
    };

    fetchRepo();
  }, [id]);

  /* ===============================
     FETCH COMMITS
  ============================== */

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await API.get(`/commit/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCommits(res.data || []);
      } catch (err) {
        console.error("Error fetching commits:", err);
      }
    };

    fetchCommits();
  }, [id]);

  /* ===============================
     CREATE COMMIT
  ============================== */

  const handleCommit = async () => {
    if (!commitMessage) return alert("Enter commit message");

    try {
      await API.post(
        `/commit/${id}`,
        {
          message: commitMessage,
          filesChanged: filesChanged.split(",").map((f) => f.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Commit created");

      setCommitMessage("");
      setFilesChanged("");

      // reload commits
      const res = await API.get(`/commit/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCommits(res.data);
    } catch (err) {
      console.error(err);
      alert("Commit failed");
    }
  };

  if (!repo) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px" }}>
        {/* REPO HEADER */}
        <h1>{repo.name}</h1>
        <p>{repo.description}</p>
        <p>Owner: {repo.owner?.username}</p>

        <hr />

        {/* COMMIT CREATION */}
        <h3>Create Commit</h3>

        <input
          type="text"
          placeholder="Commit message"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          style={{ width: "400px", marginBottom: "10px" }}
        />

        <br />

        <input
          type="text"
          placeholder="Files changed (comma separated)"
          value={filesChanged}
          onChange={(e) => setFilesChanged(e.target.value)}
          style={{ width: "400px", marginBottom: "10px" }}
        />

        <br />

        <button onClick={handleCommit}>Commit</button>

        <hr />

        {/* FILES */}
        <h3>Files</h3>
        {repo.content?.length ? (
          repo.content.map((file, index) => (
            <div key={index}>📄 {file}</div>
          ))
        ) : (
          <p>No files yet.</p>
        )}

        <hr />

        {/* COMMIT HISTORY */}
        <h3>Commit History</h3>

        {commits.length === 0 ? (
          <p>No commits yet.</p>
        ) : (
          commits.map((commit) => (
            <div
              key={commit._id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <strong>{commit.message}</strong>
              <p>Author: {commit.author?.username}</p>
              <p>Date: {new Date(commit.createdAt).toLocaleString()}</p>

              {commit.filesChanged?.length > 0 && (
                <div>
                  <b>Files:</b>
                  {commit.filesChanged.map((file, i) => (
                    <div key={i}>• {file}</div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        <hr />

        {/* ISSUES */}
        <h3>Issues</h3>
        {repo.issues?.length ? (
          repo.issues.map((issue) => (
            <div key={issue._id}>🐞 {issue.title}</div>
          ))
        ) : (
          <p>No issues.</p>
        )}
      </div>
    </>
  );
};

export default RepoDetails;
