// src/components/AuthContext.js
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

  const [className, setClassName] = useState(() => {
    return localStorage.getItem("class_name") || ""; 
  });

  // Mock chairman credentials
  const mockChairmanCredentials = {
    username: "chairman",
    password: "chairman123",
    role: "chairman",
    class_name: "Executive"
  };

  // Mock login function for chairman
  const mockChairmanLogin = (username, password) => {
    if (username === mockChairmanCredentials.username && 
        password === mockChairmanCredentials.password) {
      return {
        success: true,
        token: "mock-chairman-token-" + Date.now(),
        user: mockChairmanCredentials
      };
    }
    return { success: false };
  };

  // Sync state with localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        setIsAuthenticated(!!e.newValue);
      } else if (e.key === "username") {
        setUsername(e.newValue || "");
      } else if (e.key === "role") {
        setRole(e.newValue || "");
      } else if (e.key === "class_name") {
        setClassName(e.newValue || ""); 
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (user, password, userRole, className) => {
    console.log("Login attempt:", user, "with role:", userRole);
    
    try {
      // Check if it's a chairman login attempt
      if (user === "chairman") {
        const mockResult = mockChairmanLogin(user, password);
        if (mockResult.success) {
          // Store in localStorage
          localStorage.setItem("username", mockResult.user.username);
          localStorage.setItem("accessToken", mockResult.token);
          localStorage.setItem("role", mockResult.user.role);
          localStorage.setItem("class_name", mockResult.user.class_name);
          
          // Update state
          setIsAuthenticated(true);
          setUsername(mockResult.user.username);
          setRole(mockResult.user.role);
          setClassName(mockResult.user.class_name);
          
          return mockResult;
        } else {
          throw new Error("Invalid chairman credentials");
        }
      }

      // Regular authentication logic for other roles
      // Store in localStorage
      localStorage.setItem("username", user);
      localStorage.setItem("accessToken", "token-placeholder");
      localStorage.setItem("role", userRole);
      localStorage.setItem("class_name", className || "");
      
      // Update state
      setIsAuthenticated(true);
      setUsername(user);
      setRole(userRole);
      setClassName(className || "");
      
      return { success: true };
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Failed to authenticate");
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      
      // Only call backend logout if not a mock chairman session
      if (role !== "chairman") {
        await axiosInstance.post('logout/', {}, {
          withCredentials: true
        });
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("class_name");
      localStorage.removeItem("streakData");
      localStorage.removeItem("rewardData");
      localStorage.removeItem("completedChapters");

      setIsAuthenticated(false);
      setUsername("");
      setRole("");
      setClassName("");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.clear();
      setIsAuthenticated(false);
      setUsername("");
      setRole("");
      setClassName("");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      role, 
      className,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};