import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import API from "../../api/axios";
import "./RepoDetails.css";

const RepoDetails = () => {
  const { id } = useParams();

  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [filesChanged, setFilesChanged] = useState("");

  /* FETCH REPO */
  useEffect(() => {
    const loadRepo = async () => {
      const res = await API.get(`/repo/${id}`);
      setRepo(res.data);
    };
    loadRepo();
  }, [id]);

  /* FETCH COMMITS */
  useEffect(() => {
    const loadCommits = async () => {
      const res = await API.get(`/commit/${id}`);
      setCommits(res.data);
    };
    loadCommits();
  }, [id]);

  /* CREATE COMMIT */
  const handleCommit = async () => {
    if (!commitMessage) return;

    await API.post(`/commit/${id}`, {
      message: commitMessage,
      filesChanged: filesChanged.split(",").map(f => f.trim()),
    });

    setCommitMessage("");
    setFilesChanged("");

    const res = await API.get(`/commit/${id}`);
    setCommits(res.data);
  };

  if (!repo) return <h2 className="repo-loading">Loading repository...</h2>;

  return (
    <>
      <Navbar />

      <div className="repo-details-container">

        {/* HEADER */}
        <div className="repo-header">
          <h1>{repo.name}</h1>
          <p className="repo-desc">{repo.description}</p>
          <p className="repo-owner">Owner: {repo.owner?.username}</p>
        </div>

        {/* COMMIT PANEL */}
        <div className="commit-panel">
          <h3>Create Commit</h3>

          <input
            className="commit-input"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message"
          />

          <input
            className="commit-input"
            value={filesChanged}
            onChange={(e) => setFilesChanged(e.target.value)}
            placeholder="Files changed (comma separated)"
          />

          <button className="commit-btn" onClick={handleCommit}>
            Commit changes
          </button>
        </div>

        {/* COMMIT HISTORY */}
        <div className="repo-section">
          <h3>Commit History</h3>

          {commits.length === 0 ? (
            <p className="empty-text">No commits yet</p>
          ) : (
            commits.map(commit => (
              <div key={commit._id} className="commit-card">
                <strong>{commit.message}</strong>

                <div className="commit-meta">
                  {commit.author?.username} •{" "}
                  {new Date(commit.createdAt).toLocaleString()}
                </div>

                {commit.filesChanged?.length > 0 && (
                  <div className="commit-files">
                    {commit.filesChanged.map((file, i) => (
                      <div key={i}>• {file}</div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* FILES */}
        <div className="repo-section">
          <h3>Files</h3>

          {repo.content?.length === 0 ? (
            <p className="empty-text">No files yet</p>
          ) : (
            repo.content.map((file, i) => (
              <div key={i} className="file-item">📄 {file}</div>
            ))
          )}
        </div>

        {/* ISSUES */}
        <div className="repo-section">
          <h3>Issues</h3>

          {repo.issues?.length === 0 ? (
            <p className="empty-text">No issues</p>
          ) : (
            repo.issues.map(issue => (
              <div key={issue._id} className="issue-item">
                🐞 {issue.title}
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default RepoDetails;
