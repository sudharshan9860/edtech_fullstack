import React, { useState, useContext } from 'react';
import { Form } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../components/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock,
  faGraduationCap,
  faBook,
  faUser
} from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedPassword = password.trim();
    
    try {
      const response = await axiosInstance.post('/login/', {
        username,
        password: trimmedPassword,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username);
        login(username);
        navigate('/student-dash');
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
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
          <p className="portal-description">Access your AI-powered learning experience</p>
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
              type={showPassword ? 'text' : 'password'}
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
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button type="submit" className="start-learning-btn">
            Start Learning
          </button>

          <div className="form-footer">
            <a href="/reset-password" className="reset-link">Reset Password</a>
            <a href="/support" className="support-link">Support</a>
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