import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faChartLine, 
  faVolumeUp,
  faVolumeMute,
  faUser,
  faTachometerAlt,
  faUsers,
  faChartBar,
  faFileAlt,
  faSchool,
  faCog,
  faDatabase,
  faSun,
  faMoon,
  faBell,
  faSearch,
  faBars,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';
import { AuthContext } from './AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import SoundConfigModal from './SoundConfigModal';
import { soundManager } from '../utils/SoundManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { username, logout, role } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Enhanced state management
  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.isSoundEnabled);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('/');
  };

  // Define navigation links based on role
  const getNavigationLinks = () => {
    if (role === "admin") {
      return [
        { path: '/admin-dash', label: 'Admin Dashboard', icon: faTachometerAlt },
        { path: '/student-dash', label: 'Student Dash', icon: faUser },
        { path: '/teacher-dash', label: 'Teacher Dash', icon: faUsers },
        { path: '/analytics', label: 'Analytics', icon: faChartBar },
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine }
      ];
    } else if (role === "teacher") {
      return [
        { path: '/teacher-dash', label: 'Teacher Dash', icon: faUsers },
        { path: '/analytics', label: 'Analytics', icon: faChartBar },
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine }
      ];
    } else {
      return [
        { path: '/student-dash', label: 'Student Dash', icon: faUser },
        { path: '/analytics', label: 'Analytics', icon: faChartBar },
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine }
      ];
    }
  };

  const navigationLinks = getNavigationLinks();
  const isAdminDashboard = currentLocation.pathname === '/admin-dash';

  return (
    <div className="layout-wrapper">
      {/* Enhanced Top Navigation Bar */}
      <nav className={`enhanced-navbar ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="navbar-container">
          
          {/* Left Section - Brand and Navigation */}
          <div className="navbar-left">
            {/* Enhanced Brand */}
            <div className="navbar-brand-enhanced">
              <div className="brand-icon-wrapper">
                <span className="brand-icon">🎓</span>
              </div>
              <span className="brand-text">
                {role === 'admin' ? 'Admin Dashboard' : 'AI Educator'}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="desktop-nav">
              {navigationLinks.map((link) => (
                <button
                  key={link.path}
                  className={`nav-item-enhanced ${currentLocation.pathname === link.path ? 'active' : ''}`}
                  onClick={() => navigate(link.path)}
                >
                  <FontAwesomeIcon icon={link.icon} className="nav-icon-enhanced" />
                  <span className="nav-label-enhanced">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Center Section - Search (Optional) */}
          <div className="navbar-center">
            <div className="search-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>

          {/* Right Section - Controls and User */}
          <div className="navbar-right">
            
            {/* Sound Toggle */}
            <button
              className="control-btn"
              onClick={() => setShowSoundConfig(true)}
              title="Sound Settings"
            >
              <FontAwesomeIcon 
                icon={isSoundEnabled ? faVolumeUp : faVolumeMute} 
                className="control-icon" 
              />
            </button>

            {/* Enhanced Notifications */}
            <div className="notification-wrapper-enhanced">
              <button
                className="control-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FontAwesomeIcon icon={faBell} className="control-icon" />
                <span className="notification-badge">3</span>
              </button>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <span className="notification-count">3 new</span>
                  </div>
                  <div className="notifications-list">
                    <div className="notification-item">
                      <div className="notification-content">
                        <p>New assignment submitted</p>
                        <span className="notification-time">2 min ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <p>Performance report ready</p>
                        <span className="notification-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-content">
                        <p>System maintenance scheduled</p>
                        <span className="notification-time">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button className="view-all-btn">View All</button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              className="control-btn theme-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <FontAwesomeIcon 
                icon={isDarkMode ? faSun : faMoon} 
                className="control-icon" 
              />
            </button>

            {/* Enhanced User Section */}
            <div className="user-section-enhanced">
              <button
                className="user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="user-info-enhanced">
                  <span className="username-enhanced">{username}</span>
                  <span className="role-badge-enhanced">{role}</span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-avatar-large">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>
                      <div className="username-large">{username}</div>
                      <div className="role-large">{role}</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    <a href="#" className="dropdown-item">
                      <FontAwesomeIcon icon={faUser} />
                      Profile Settings
                    </a>
                    <a href="#" className="dropdown-item">
                      <FontAwesomeIcon icon={faCog} />
                      Account Settings
                    </a>
                    <a href="#" className="dropdown-item">
                      <FontAwesomeIcon icon={faBell} />
                      Notifications
                    </a>
                  </div>
                  
                  <div className="dropdown-footer">
                    <button className="logout-btn-enhanced" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            {navigationLinks.map((link) => (
              <button
                key={link.path}
                className={`mobile-nav-item ${currentLocation.pathname === link.path ? 'active' : ''}`}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
              >
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Overlay for dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="dropdown-overlay" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Sound Configuration Modal */}
      <SoundConfigModal 
        show={showSoundConfig} 
        onHide={() => setShowSoundConfig(false)} 
      />

      {/* Main Content */}
      <main className="main-content-enhanced">
        {children}
      </main>
    </div>
  );
};

export default Layout;