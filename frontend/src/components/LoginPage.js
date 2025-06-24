import React, { useState, useContext, useMemo } from "react";
import { Form } from "react-bootstrap";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../components/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faGraduationCap,
  faBook,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Generate background circles using useMemo
  const backgroundCircles = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: i,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: Math.random() * 100,
      top: Math.random() * 150,
      delay: Math.random() * 2,
    }));
  }, []);

  // Helper function to get CSRF token
  const getCSRFToken = () => {
    const name = 'csrftoken';
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const trimmedPassword = password.trim();

    // Basic validation
    if (!username || !trimmedPassword) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      // Get CSRF token before making request
      const csrfToken = getCSRFToken();
      
      const response = await axiosInstance.post(
        "/login/",
        {
          username,
          password: trimmedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken && { "X-CSRFToken": csrfToken }),
          },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);
      const { token } = response.data;
      const role = response.data.role;

      if (token) {
        // Store token and username in localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // Update auth context
        login(username, token, role);

        // Role-based navigation with admin support
        if (role === "admin") {
          navigate("/admin-dash");
        } else if (role === "teacher") {
          navigate("/teacher-dash");
        } else {
          navigate("/student-dash");
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setError("Invalid username or password.");
        } else if (error.response.status === 403) {
          setError("Access forbidden. Please check your credentials.");
        } else if (error.response.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else {
          setError(error.response?.data?.message || `Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        // Network error
        setError("Unable to connect to server. Please check your network connection.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      {/* Background Animation */}
      <div className="background-container">
        {backgroundCircles.map((circle) => (
          <motion.div
            key={circle.id}
            className="animated-circle"
            style={{
              width: `${circle.width}px`,
              height: `${circle.height}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: -50,
              y: -50,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.2, 0.8],
              x: [-50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [-50, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 6 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: circle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Login Form Container */}
      <motion.div 
        className="login-form-container"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo Section */}
        <motion.div 
          className="logo-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="platform-name">AI EDUCATOR</h1>
          <p className="platform-subtitle">Smart Learning Platform for Grades 9-12</p>
        </motion.div>

        {/* Portal Section */}
        <motion.div 
          className="portal-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="portal-icons">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faGraduationCap} size="lg" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: -15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faBook} size="lg" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
            </motion.div>
          </div>
          <h2 className="portal-title">Student Portal</h2>
          <p className="portal-description">
            Access your AI-powered learning experience
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            className="error-alert"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <Form onSubmit={handleSubmit} className="login-form">
          <motion.div 
            className="input-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </div>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              disabled={isLoading}
              autoComplete="username"
            />
          </motion.div>

          <motion.div 
            className="input-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </motion.div>

          <motion.button 
            type="submit" 
            className="start-learning-btn"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {isLoading ? (
              <span>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block", marginRight: "8px" }}
                >
                  ⟳
                </motion.span>
                Signing In...
              </span>
            ) : (
              "Start Learning"
            )}
          </motion.button>

          {/* Footer Links */}
          <motion.div 
            className="form-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <a 
              href="#" 
              className="reset-link"
              onClick={(e) => {
                e.preventDefault();
                console.log("Reset password clicked");
              }}
            >
              Reset Password
            </a>
            <a 
              href="#" 
              className="support-link"
              onClick={(e) => {
                e.preventDefault();
                console.log("Support clicked");
              }}
            >
              Support
            </a>
          </motion.div>
        </Form>

        {/* Copyright */}
        <motion.div 
          className="copyright"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          © 2025 AI EDUCATOR. All rights reserved.
        </motion.div>
      </motion.div>

      {/* Access Levels Information */}
      <motion.div 
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "14px"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p>
          <strong>Access Levels:</strong> Student • Teacher • Admin
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;