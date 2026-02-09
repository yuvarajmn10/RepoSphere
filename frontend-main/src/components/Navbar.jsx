import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";
import "./navbar.css";
import logo from "../assets/logo.png";


const Navbar = () => {
  const { currentUser, username, logout } = useAuth();

  return (
    <nav>
      {/* Logo */}
      <Link to="/">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo}  alt="RepoSphere Logo" style={{ width: "90px", height: "90px", objectFit: "contain" }}/>
          <h1 style={{ margin: 0,  fontSize: "22px", fontWeight: "700",  letterSpacing: "1px",  color: "#ffffff"}}>REPOSPHERE</h1>
        </div>

      </Link>

      {/* Right side menu */}
      <div>
        {currentUser ? (
          <>
            <Link to="/create">
              <p>Create Repository</p>
            </Link>

            <Link to="/profile">
              <p>{username || "Profile"}</p>
            </Link>

            <p
              style={{ cursor: "pointer", color: "red" }}
              onClick={logout}
            >
              Logout
            </p>
          </>
        ) : (
          <>
            <Link to="/auth">
              <p>Login</p>
            </Link>

            <Link to="/signup">
              <p>Signup</p>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
