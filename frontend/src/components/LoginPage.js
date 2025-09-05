import React, { useState, useContext, useMemo } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import axiosInstance from "../api/axiosInstance";
import "./Login.css";
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
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Background animation circles
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axiosInstance.login(username, password);

    const {
      access,
      refresh,
      username: user,
      role,
      email,
      full_name,
      class_name,
    } = response;

    // Extra user info (tokens already set by axiosInstance.login)
    localStorage.setItem("username", user);
    localStorage.setItem("role", role);
    localStorage.setItem("fullName", full_name || "");
    if (class_name) {
      localStorage.setItem("className", class_name);
    }

    // Update auth context
    login(user, access, role, class_name);

     // Navigate based on role
      if (role === "admin") {
        navigate("/chairman-dashboard");
      } else if (role === "teacher") {
        navigate("/teacher-dash");
      } else {
        navigate("/student-dash");
      }

  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.detail ||
        err.message ||
        "Invalid username or password."
    );
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
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

      <div className="login-form-container">
        <div className="logo-section">
          <h1 className="platform-name">AI EDUCATOR</h1>
        </div>

        <div className="portal-section">
          <div className="portal-icons">
            <FontAwesomeIcon icon={faGraduationCap} size="lg" />
            <FontAwesomeIcon icon={faBook} size="lg" />
            <FontAwesomeIcon icon={faUser} size="lg" />
          </div>
          <h2 className="portal-title">Student Portal</h2>
          <p className="portal-description">
            Access your AI-powered learning experience
          </p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <Form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </div>
            <input
              type="text"
              placeholder="Student Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          <button type="submit" className="start-learning-btn">
            Start Learning
          </button>

          <div className="form-footer">
            <a href="/reset-password" className="reset-link">
              Reset Password
            </a>
            <a href="/support" className="support-link">
              Support
            </a>
          </div>
        </Form>

        <div className="copyright">
          © 2025 AI EDUCATOR. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;