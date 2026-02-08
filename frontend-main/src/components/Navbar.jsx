import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";
import "./navbar.css";

const Navbar = () => {
  const { currentUser, username, logout } = useAuth();

  return (
    <nav>
      {/* Logo */}
      <Link to="/">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
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
