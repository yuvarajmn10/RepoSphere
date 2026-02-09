import React, { useEffect, useState } from "react";
import "./profile.css";
import Navbar from "../Navbar";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [preview, setPreview] = useState(null);
  const [storedImage, setStoredImage] = useState(
    localStorage.getItem("profileImage")
  );
  const [starredRepos, setStarredRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* FETCH STARRED */
  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const res = await API.get("/repo/starred");
        setStarredRepos(res.data || []);
      } catch (err) {
        console.error("Starred repo error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarred();
  }, []);

  /* UPLOAD PROFILE IMAGE */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/user/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ⭐ SAVE TO LOCAL STORAGE
      localStorage.setItem("profileImage", res.data.profileImage);
      setStoredImage(res.data.profileImage);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  /* UNSTAR */
  const handleUnstar = async (repoId) => {
    try {
      await API.delete(`/repo/star/${repoId}`);
      setStarredRepos(prev => prev.filter(repo => repo._id !== repoId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-page-wrapper">

        {/* LEFT */}
        <div className="user-profile-section">

          <img
            className="profile-image"
            src={
              preview
                ? preview
                : storedImage
                ? `http://localhost:3000${storedImage}`
                : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            }
            alt="profile"
          />

          <label className="upload-btn">
            Change profile photo
            <input type="file" onChange={handleUpload} hidden />
          </label>

          <h3 style={{ marginTop: "14px" }}>Your Profile</h3>
          <p style={{ color: "#8b949e" }}>
            Manage repositories & stars
          </p>
        </div>

        {/* RIGHT */}
        <div className="heat-map-section">

          <h2 style={{ marginBottom: "20px" }}>⭐ Starred Repositories</h2>

          {loading ? (
            <p>Loading...</p>
          ) : starredRepos.length === 0 ? (
            <p style={{ color: "#8b949e" }}>
              You haven’t starred anything yet.
            </p>
          ) : (
            <div className="starred-grid">
              {starredRepos.map((repo) => (
                <div className="starred-card" key={repo._id}>

                  <div
                    className="starred-info"
                    onClick={() => navigate(`/repo/${repo._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h4>{repo.name}</h4>
                    <p>{repo.description}</p>
                    <small>Owner: {repo.owner?.username}</small>
                  </div>

                  <button
                    className="unstar-btn"
                    onClick={() => handleUnstar(repo._id)}
                  >
                    Unstar
                  </button>

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
