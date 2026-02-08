import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetails from "./components/repo/RepoDetails";
import StarredRepos from "./components/repo/StarredRepos";



// Auth context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    // restore session on refresh
    if (storedUserId && !currentUser) {
      setCurrentUser(storedUserId);
    }

    // if not logged in → force auth
    if (!storedUserId && !["/auth", "/signup"].includes(location.pathname)) {
      navigate("/auth");
    }

    // if logged in → prevent visiting login page
    if (storedUserId && location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser, location.pathname]);

const element = useRoutes([
  { path: "/", element: <Dashboard /> },
  { path: "/auth", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/profile", element: <Profile /> },
  { path: "/create", element: <CreateRepo /> },
  { path: "/repo/:id", element: <RepoDetails/>},
  { path: "/starred", element: <StarredRepos />}

]);

  return element;
};

export default ProjectRoutes;
