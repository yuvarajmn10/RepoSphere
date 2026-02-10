import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  /* =========================
     LOAD FROM LOCAL STORAGE
  ========================= */
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const uname = localStorage.getItem("username");
    const img = localStorage.getItem("profileImage");

    if (userId) setCurrentUser(userId);
    if (uname) setUsername(uname);
    if (img) setProfileImage(img);
  }, []);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    if (data.profileImage) {
      localStorage.setItem("profileImage", data.profileImage);
      setProfileImage(data.profileImage);
    }

    setCurrentUser(data.userId);
    setUsername(data.username);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    window.location.replace("/auth");
  };

  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = {
    currentUser,
    setCurrentUser,     // ⭐ RESTORED
    username,
    setUsername,        // ⭐ RESTORED
    profileImage,
    setProfileImage,
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
