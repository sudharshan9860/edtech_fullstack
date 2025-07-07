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
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';
import { AuthContext } from './AuthContext';
import { useTheme } from '../contexts/ThemeContext'; // Import theme context
import NotificationDropdown from './NotificationDropdown';
import SoundConfigModal from './SoundConfigModal';
import { soundManager } from '../utils/SoundManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { username, logout, role } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme(); // Use theme context
  
  // Sound configuration state
  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.isSoundEnabled);

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('/');
  };

  // Define navigation links based on role - REMOVED LEADERBOARD AND QUESTS
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

  // Check if current route is admin dashboard (the main admin-dash route)
  const isAdminDashboard = currentLocation.pathname === '/admin-dash';

  return (
    <div className="layout-wrapper">
      {/* Top Navigation Bar */}
      <Navbar expand="lg" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand className="navbar-brand-custom">
            {role === 'admin' ? 'Admin Dashboard' : 'AI Educator'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="navbar-nav-custom">
                {navigationLinks.map((link) => (
                  <Nav.Link
                    key={link.path}
                    className={`nav-link-custom ${currentLocation.pathname === link.path ? 'active' : ''}`}
                    onClick={() => navigate(link.path)}
                  >
                    {link.icon && (
                      <FontAwesomeIcon icon={link.icon} className="nav-icon" />
                    )}
                    <span className="nav-label">{link.label}</span>
                  </Nav.Link>
                ))}
                
                {/* Sound Toggle */}
                <Nav.Link 
                  className="nav-link-custom"
                  onClick={() => setShowSoundConfig(true)}
                >
                  <FontAwesomeIcon 
                    icon={isSoundEnabled ? faVolumeUp : faVolumeMute} 
                    className="nav-icon" 
                  />
                  <span className="nav-label">Sound</span>
                </Nav.Link>

                {/* Notification Dropdown */}
                <div className="notification-wrapper">
                  <NotificationDropdown />
                </div>

                {/* User Info Section */}
                <div className="user-section">
                  <div className="user-info">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <span className="username-display">{username}</span>
                    <span className="role-badge">{role}</span>
                  </div>
                  <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </button>
                  
                  {/* Theme Toggle Button - Positioned after logout */}
                  <button 
                    className="theme-toggle-btn-layout"
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    <FontAwesomeIcon 
                      icon={isDarkMode ? faSun : faMoon} 
                      className="theme-icon" 
                    />
                    <span className="theme-label">
                      {isDarkMode ? 'Light' : 'Dark'} Mode
                    </span>
                  </button>
                </div>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="main-content">
        {role === 'admin' && !isAdminDashboard ? (
          <div className="admin-layout">
            {/* Admin Sidebar for specific admin routes */}
            <div className="admin-sidebar">
              <div className="sidebar-header">
                <div className="sidebar-icon">
                  <FontAwesomeIcon icon={faCog} />
                </div>
                <h3>Admin Panel</h3>
                <p>System Management</p>
              </div>
              <Nav className="flex-column sidebar-nav">
                {navigationLinks.map((link) => (
                  <Nav.Link
                    key={link.path}
                    className={`sidebar-item ${currentLocation.pathname === link.path ? 'active' : ''}`}
                    onClick={() => navigate(link.path)}
                  >
                    <FontAwesomeIcon icon={link.icon} className="sidebar-icon" />
                    <span>{link.label}</span>
                  </Nav.Link>
                ))}
              </Nav>
            </div>
            
            {/* Admin Main Content */}
            <div className="admin-main-content">
              {children}
            </div>
          </div>
        ) : (
          <div className="regular-content">
            {children}
          </div>
        )}
      </div>

      {/* Sound Configuration Modal */}
      {showSoundConfig && (
        <SoundConfigModal 
          isOpen={showSoundConfig}
          onClose={() => setShowSoundConfig(false)}
          currentEnabled={isSoundEnabled}
          onSoundToggle={(enabled) => {
            setIsSoundEnabled(enabled);
            soundManager.setSoundEnabled(enabled);
          }}
        />
      )}
    </div>
  );
};

export default Layout;