import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage with fallback
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "";
  });

  // Sync state with localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!e.newValue);
      } else if (e.key === "username") {
        setUsername(e.newValue || "");
      } else if (e.key === "role") {
        setRole(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (user, token, userRole) => {
    try {
      // Store in localStorage
      localStorage.setItem("username", user);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", userRole);

      // Update state
      setIsAuthenticated(true);
      setUsername(user);
      setRole(userRole);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Failed to store authentication data");
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await axiosInstance.post('logout/', {}, {
        withCredentials: true
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");

      setIsAuthenticated(false);
      setUsername("");
      setRole("");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.clear();
      setIsAuthenticated(false);
      setUsername("");
      setRole("");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
