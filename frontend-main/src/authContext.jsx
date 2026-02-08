import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const uname = localStorage.getItem("username");
    const img = localStorage.getItem("profileImage");

    if (userId) setCurrentUser(userId);
    if (uname) setUsername(uname);
    if (img) setProfileImage(img);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const value = {
    currentUser,
    setCurrentUser,
    username,
    setUsername,
    profileImage,
    setProfileImage,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
