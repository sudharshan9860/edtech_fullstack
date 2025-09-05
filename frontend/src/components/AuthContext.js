// src/components/AuthContext.jsx - Updated to support admin authentication
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuthStatus = () => {
      const token = localStorage.getItem('access_token');
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('userRole');
      const storedEmail = localStorage.getItem('userEmail');

      if (token && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        setUserRole(storedRole || 'student');
        setUserEmail(storedEmail || '');
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUsername(userData.username);
    setUserRole(userData.role || 'student');
    setUserEmail(userData.email || '');
    
    // Store in localStorage (already done in LoginPage, but ensure consistency)
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userRole', userData.role || 'student');
    localStorage.setItem('userEmail', userData.email || '');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserRole('');
    setUserEmail('');
    
    // Clear all authentication-related data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('streakData');
    localStorage.removeItem('rewardData');
    localStorage.removeItem('completedChapters');
    
    // Redirect to login
    window.location.href = '/login';
  };

  // Helper function to check if current user is admin
  const isAdmin = () => {
    return userRole === 'admin' || username === 'admin';
  };

  // Helper function to check if current user is teacher
  const isTeacher = () => {
    return userRole === 'teacher';
  };

  // Helper function to check if current user is student
  const isStudent = () => {
    return userRole === 'student' || (!userRole && isAuthenticated);
  };

  const contextValue = {
    isAuthenticated,
    username,
    userRole,
    userEmail,
    loading,
    login,
    logout,
    isAdmin,
    isTeacher,
    isStudent
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};