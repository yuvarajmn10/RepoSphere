import React, { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../authContext";

import { Heading } from "@primer/react";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth(); // ⭐ use context login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // ⭐ CENTRALIZED LOGIN STORAGE
      loginUser(res.data);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="logo-header">
        <img className="logo-login" src={logo} alt="Logo" />
        <div className="logo-name">REPOSPHERE</div>
      </div>



      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
           <Heading as="h2" sx={{ mb: 3 }}>
                Sign In
           </Heading>

          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            New here? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
