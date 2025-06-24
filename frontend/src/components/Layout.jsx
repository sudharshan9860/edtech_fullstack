import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav, Offcanvas } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faChartLine, 
  faVolumeUp,
  faVolumeMute,
  faTrophy,
  faUser,
  faTachometerAlt,
  faUsers,
  faChartBar,
  faFileAlt,
  faSchool,
  faCog,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';
import { AuthContext } from './AuthContext';
import NotificationDropdown from './NotificationDropdown';
import SoundConfigModal from './SoundConfigModal';
import { soundManager } from '../utils/SoundManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { username, logout, role } = useContext(AuthContext);
  
  // Sound configuration state
  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.isSoundEnabled);

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
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine },
        { path: '/leaderboard', label: 'Leaderboard', icon: faTrophy }
      ];
    } else if (role === "teacher") {
      return [
        { path: '/teacher-dash', label: 'Teacher Dash', icon: faUsers },
        { path: '/analytics', label: 'Analytics', icon: faChartBar },
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine },
        { path: '/leaderboard', label: 'Leaderboard', icon: faTrophy },
        { path: '/quests', label: 'Quests', icon: faTrophy }
      ];
    } else {
      return [
        { path: '/student-dash', label: 'Student Dash', icon: faUser },
        { path: '/analytics', label: 'Analytics', icon: faChartBar },
        { path: '/progress-dashboard', label: 'Progress', icon: faChartLine },
        { path: '/leaderboard', label: 'Leaderboard', icon: faTrophy },
        { path: '/quests', label: 'Quests', icon: faTrophy }
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
            {role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
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
                </Nav.Link>

                {/* Notifications for students */}
                {role === 'student' && (
                  <div className="notification-wrapper">
                    <NotificationDropdown />
                  </div>
                )}
                
                {/* User section */}
                <Nav.Item className="user-section">
                  <div className="user-info">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    <span className="username-display">{username}</span>
                    <span className="role-badge">{role}</span>
                  </div>
                  <button
                    onClick={handleLogout}  
                    className="logout-btn"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Logout</span>
                  </button>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Regular layout for all users - NO SIDEBAR for students and teachers */}
        <Container fluid className="regular-content">
          {children}
        </Container>
      </main>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <p>&copy; 2025 AI EDUCATOR. All rights reserved.</p>
        </Container>
      </footer>

      {/* Sound Configuration Modal */}
      <SoundConfigModal 
        show={showSoundConfig} 
        onHide={() => setShowSoundConfig(false)} 
      />
    </div>
  );
};

export default Layout;