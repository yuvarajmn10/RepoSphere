import React, { useState } from "react";
import Navbar from "../Navbar";
import API from "../../api/axios";
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);

  const handleCreateRepo = async () => {
    try {
      await API.post("/repo/create", {
        name,
        description,
        visibility,
      });

      alert("Repository created!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to create repository");
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-repo-wrapper">
        <div className="create-repo-card">
          <h2>Create new repository</h2>

          <input
            type="text"
            placeholder="Repository name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="visibility">
            <input
              type="checkbox"
              checked={visibility}
              onChange={() => setVisibility(!visibility)}
            />
            Public repository
          </label>

          <button onClick={handleCreateRepo}>
            Create Repository
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
