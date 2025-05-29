import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; 
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

  // Effect to sync localStorage with state
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!e.newValue);
      } else if (e.key === "username") {
        setUsername(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (user, token) => {
    try {
      // Store both username and token
      localStorage.setItem("username", user);
      localStorage.setItem("accessToken", token);

      // Update state
      setIsAuthenticated(true);
      setUsername(user);
    } catch (error) {
      console.error("Error during login:", error);
      // Handle storage errors (e.g., quota exceeded)
      throw new Error("Failed to store authentication data");
    }
  };

// Ensure this is uncommented

  const logout = async () => {
    try {
      console.log("Logging out from try block...");
      const response = await axiosInstance.post('logout/', {}, {
        withCredentials: true
      });
      console.log("Logout response:", response);
  
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");
  
      setIsAuthenticated(false);
      setUsername("");
  
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.clear();
      setIsAuthenticated(false);
      setUsername("");
      window.location.href = "/login";
    }
  };
  
    return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};